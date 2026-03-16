// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { defineConfig, type Plugin, type UserConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
);

const fileHash = (filePath: string): string => {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(content).digest("hex");
  } catch {
    return "";
  }
};

const publicScriptsDir = path.resolve(__dirname, "../../public/scripts");

const getBuildDate = () => {
  const today = new Date();
  return `${today.toISOString().split(".")[0]}Z`;
};

const getBuildYear = () => new Date().getFullYear();

const banner = `/*
* (c) Copyright Ascensio System SIA 2009-${getBuildYear()}. All rights reserved
*
* https://www.onlyoffice.com/
*
* Version: ${pkg.version} (build at: ${getBuildDate()})
*/`;

// ---------------------------------------------------------------------------
// Custom plugin: transform JSX in .js files via esbuild.
// The project was ejected from CRA where Babel processed all .js files with
// JSX support. Vite/Rollup only handles JSX in .jsx/.tsx files by default.
// This plugin pre-transforms .js files containing JSX before Rollup parses them.
// ---------------------------------------------------------------------------
const jsxInJsPlugin = (): Plugin => ({
  name: "jsx-in-js",
  enforce: "pre",
  config() {
    return {
      optimizeDeps: {
        esbuildOptions: {
          loader: {
            ".js": "jsx",
          },
        },
      },
    };
  },
  async transform(code, id) {
    if (!id.endsWith(".js") || id.includes("node_modules")) return null;
    // Quick check: skip files that clearly don't contain JSX.
    // Match opening JSX tags (<Component, <div) or closing tags (</),
    // but not plain comparison operators (a < b).
    if (!/(<\/|<[A-Za-z])/.test(code)) return null;

    return transformWithEsbuild(code, id, {
      loader: "jsx",
      jsx: "automatic",
      jsxImportSource: "react",
    });
  },
});

// ---------------------------------------------------------------------------
// Custom plugin: rewrite ?url imports from ASSETS_DIR / PUBLIC_DIR into
// plain const declarations with public URL strings and ?hash= cache busters.
//
// Vite's built-in ?url handling emits assets with content-hashed filenames
// (e.g. icon.C6ykIhR6.svg) which breaks the existing nginx cache-control
// setup that relies on ?hash= query parameters.  Files from public/ must be
// served by nginx — NOT bundled into dist/.
//
// This plugin uses a transform hook (runs before Rollup's import analysis)
// to rewrite:
//   import X from "ASSETS_DIR/locales/ru/File.json?url";
//     → const X = "/locales/ru/File.json?hash=<md5>";
//   import Y from "PUBLIC_DIR/images/icons/16/icon.svg?url";
//     → const Y = "/static/images/icons/16/icon.svg?hash=<md5>";
//
// PUBLIC_DIR non-JSON files get a /static/ prefix (nginx serves root
// public/ at /static/).  JSON translation files skip the prefix because
// language-helpers.js prepends it for Common namespace files.
// ---------------------------------------------------------------------------
const staticUrlPlugin = (): Plugin => {
  const assetsDir = path.resolve(__dirname, "public");
  const publicDir = path.resolve(__dirname, "../../public");

  return {
    name: "static-url-import",
    enforce: "pre",

    transform(code) {
      if (!code.includes("?url")) return null;

      let changed = false;

      const importRe =
        /import\s+(\w+)\s+from\s+["']((?:ASSETS_DIR|PUBLIC_DIR)\/[^"']+)\?url["'];?/g;

      const result = code.replace(
        importRe,
        (_match, varName: string, importPath: string) => {
          changed = true;

          let resolved: string;
          let relativePath: string;
          let prefix = "";

          if (importPath.startsWith("ASSETS_DIR/")) {
            resolved = path.resolve(
              assetsDir,
              importPath.slice("ASSETS_DIR/".length),
            );
            relativePath = path.relative(assetsDir, resolved);
          } else {
            resolved = path.resolve(
              publicDir,
              importPath.slice("PUBLIC_DIR/".length),
            );
            relativePath = path.relative(publicDir, resolved);
            // Non-JSON files from PUBLIC_DIR need /static prefix because
            // nginx serves the root public/ directory at /static/.
            // JSON translation files skip this — language-helpers.js adds it.
            if (!resolved.endsWith(".json")) {
              prefix = "/static";
            }
          }

          const urlPath =
            prefix + "/" + relativePath.split(path.sep).join("/");
          const hash = fileHash(resolved);
          const url = hash ? `${urlPath}?hash=${hash}` : urlPath;

          return `const ${varName} = ${JSON.stringify(url)};`;
        },
      );

      if (!changed) return null;
      return { code: result, map: null };
    },
  };
};

// ---------------------------------------------------------------------------
// Custom plugin: inject content hashes into index.html placeholders.
// In dev mode, when accessed through a backend proxy (e.g. port 8092),
// rewrite the module entry point to use an absolute Vite URL so the browser
// loads ES modules directly from the Vite dev server instead of the proxy.
// ---------------------------------------------------------------------------
const htmlTransformPlugin = (): Plugin => {
  // Captured from the incoming request so transformIndexHtml can build
  // absolute Vite URLs that work regardless of which host the browser uses.
  let currentRequestHost = "localhost";

  return {
    name: "html-transform",

    configureServer(server) {
      // Runs BEFORE Vite's internal HTML middleware, so the host is
      // already captured by the time transformIndexHtml fires.
      server.middlewares.use((req, _res, next) => {
        if (req.headers.host) {
          currentRequestHost = req.headers.host.split(":")[0];
        }
        next();
      });
    },

    transformIndexHtml: {
      // "post" order so we run AFTER Vite injects /@vite/client and
      // @vitejs/plugin-react injects the /@react-refresh preamble.
      // This lets us rewrite all module URLs to absolute Vite origin,
      // preventing split module identity when served through a proxy.
      order: "post",
      handler(html, ctx) {
        html = html
          .replace(
            /%DOCSPACE_BROWSER_DETECTOR_HASH%/g,
            fileHash(path.join(publicScriptsDir, "browserDetector.js")),
          )
          .replace(
            /%DOCSPACE_CONFIG_HASH%/g,
            fileHash(path.join(publicScriptsDir, "config.json")),
          )
          .replace(
            /%DOCSPACE_FONTS_CSS_HASH%/g,
            fileHash(
              path.resolve(__dirname, "../../public/css/fonts.css"),
            ),
          );

        // In dev mode, rewrite ALL module URLs to use absolute Vite origin.
        // When the page is served through a proxy (e.g. nginx on :8092),
        // relative imports like /@vite/client and /@react-refresh resolve
        // to the proxy origin, while bootstrap.js loads from Vite directly.
        // This creates two separate /@react-refresh module instances —
        // the preamble hooks register on one, but components register on
        // the other, breaking React Fast Refresh.
        if (ctx.server) {
          const port = ctx.server.config.server.port || 5001;
          const host = process.env.VITE_DEV_HOST || currentRequestHost;
          const viteOrigin = `http://${host}:${port}`;
          html = html
            .replace(
              'src="/src/bootstrap.js"',
              `src="${viteOrigin}/src/bootstrap.js"`,
            )
            .replace(
              'src="/@vite/client"',
              `src="${viteOrigin}/@vite/client"`,
            )
            .replace(
              / from\s+"\/(@react-refresh)"/g,
              ` from "${viteOrigin}/$1"`,
            );
        }

        return html;
      },
    },
  };
};

// ---------------------------------------------------------------------------
// Custom plugin: add copyright banner to JS/CSS output (production only)
// ---------------------------------------------------------------------------
const bannerPlugin = (): Plugin => ({
  name: "banner-plugin",
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === "chunk") {
        chunk.code = banner + "\n" + chunk.code;
      } else if (
        chunk.type === "asset" &&
        typeof chunk.fileName === "string" &&
        chunk.fileName.endsWith(".css") &&
        typeof chunk.source === "string"
      ) {
        chunk.source = banner + "\n" + chunk.source;
      }
    }
  },
});

// ---------------------------------------------------------------------------
// Custom plugin: copy and minify locale JSON files to dist/ (production build)
// Replaces Webpack's CopyPlugin with minifyJson transform.
// ---------------------------------------------------------------------------
function copyAndMinifyLocales(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyAndMinifyLocales(srcPath, destPath);
    } else if (entry.name.endsWith(".json")) {
      try {
        const content = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
        fs.writeFileSync(destPath, JSON.stringify(content), "utf-8");
      } catch {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const copyLocalesPlugin = (): Plugin => ({
  name: "copy-locales",
  closeBundle() {
    const srcDir = path.resolve(__dirname, "public/locales");
    const destDir = path.resolve(__dirname, "dist/locales");
    copyAndMinifyLocales(srcDir, destDir);
  },
});

// ---------------------------------------------------------------------------
// Custom plugin: copy fonts CSS and font files to dist/static/ (production build)
// In production these are served by nginx from /var/www/public/ at /static/.
// For E2E tests (serve dist -s) and self-contained builds, we need them in dist/.
// ---------------------------------------------------------------------------
const copyFontsPlugin = (): Plugin => ({
  name: "copy-fonts",
  closeBundle() {
    const rootPublicDir = path.resolve(__dirname, "../../public");

    // Copy css/fonts.css → dist/static/css/fonts.css
    const cssSrc = path.join(rootPublicDir, "css/fonts.css");
    const cssDest = path.resolve(__dirname, "dist/static/css");
    if (fs.existsSync(cssSrc)) {
      fs.mkdirSync(cssDest, { recursive: true });
      fs.copyFileSync(cssSrc, path.join(cssDest, "fonts.css"));
    }

    // Copy fonts/v35/ → dist/static/fonts/v35/
    const fontsSrc = path.join(rootPublicDir, "fonts");
    const fontsDest = path.resolve(__dirname, "dist/static/fonts");
    if (fs.existsSync(fontsSrc)) {
      const copyDir = (src: string, dest: string) => {
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };
      copyDir(fontsSrc, fontsDest);
    }
  },
});

// ---------------------------------------------------------------------------
// Custom plugin: serve files from root public/ directory in dev mode.
// The root public/ contains scripts/config.json, images/, css/fonts.css, etc.
// These are normally served by nginx in production, but in dev we need
// Vite to serve them as a fallback.
// ---------------------------------------------------------------------------
const serveRootPublicPlugin = (): Plugin => {
  const rootPublicDir = path.resolve(__dirname, "../../public");

  return {
    name: "serve-root-public",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        let urlPath = req.url.split("?")[0];
        // Strip /static/ prefix — nginx serves root public/ at /static/
        if (urlPath.startsWith("/static/")) {
          urlPath = urlPath.slice("/static".length);
        }
        const filePath = path.join(rootPublicDir, urlPath);

        // Prevent path traversal outside rootPublicDir
        if (!filePath.startsWith(rootPublicDir)) return next();

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          const mimeTypes: Record<string, string> = {
            ".json": "application/json",
            ".js": "application/javascript",
            ".css": "text/css",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".gif": "image/gif",
            ".ico": "image/x-icon",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
            ".eot": "application/vnd.ms-fontobject",
          };
          res.setHeader(
            "Content-Type",
            mimeTypes[ext] || "application/octet-stream",
          );
          fs.createReadStream(filePath).pipe(res);
          return;
        }

        next();
      });
    },
  };
};

// ===========================================================================
// Main Vite configuration
// ===========================================================================
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const isProduction = mode === "production";
  const isAnalyze = mode === "analyze";

  return {
    root: __dirname,
    base: "/",

    resolve: {
      alias: {
        PUBLIC_DIR: path.resolve(__dirname, "../../public"),
        ASSETS_DIR: path.resolve(__dirname, "./public"),
        SRC_DIR: path.resolve(__dirname, "./src"),
        PACKAGE_FILE: path.resolve(__dirname, "package.json"),
        COMMON_DIR: path.resolve(__dirname, "../common"),
        "@docspace/shared": path.resolve(__dirname, "../shared"),
        "@docspace/ui-kit": path.resolve(__dirname, "../../libs/ui-kit"),
      },
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      dedupe: ["styled-components", "react", "react-dom"],
    },

    define: {
      VERSION: JSON.stringify(pkg.version),
      BUILD_AT: JSON.stringify(getBuildDate()),
      "process.env.NODE_ENV": JSON.stringify(mode),
    },

    plugins: [
      jsxInJsPlugin(),
      staticUrlPlugin(),
      svgr({
        svgrOptions: {
          exportType: "default",
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        },
        include: "**/*.svg",
        exclude: "**/*.svg?url",
      }),
      react(),
      htmlTransformPlugin(),
      serveRootPublicPlugin(),
      isProduction && bannerPlugin(),
      isProduction && copyLocalesPlugin(),
      isProduction && copyFontsPlugin(),
      isAnalyze &&
        (await import("rollup-plugin-visualizer")).visualizer({
          open: true,
          filename: "dist/stats.html",
        }),
    ].filter(Boolean),

    css: {
      modules: {
        generateScopedName: "[name]__[local]--[hash:base64:5]",
      },
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          importers: [
            {
              findFileUrl(url: string) {
                if (url.startsWith("@docspace/ui-kit")) {
                  const resolved = url.replace(
                    "@docspace/ui-kit",
                    path.resolve(__dirname, "../../libs/ui-kit"),
                  );
                  return new URL(
                    `file:///${resolved.split(path.sep).join("/")}`,
                  );
                }
                if (url.startsWith("@docspace/shared")) {
                  const resolved = url.replace(
                    "@docspace/shared",
                    path.resolve(__dirname, "../shared"),
                  );
                  return new URL(
                    `file:///${resolved.split(path.sep).join("/")}`,
                  );
                }
                return null;
              },
            },
          ],
        },
      },
    },

    server: {
      host: true,
      port: parseInt(process.env.PORT || "5001"),
      strictPort: true,
      cors: true,
      // Allow the page loaded from the backend proxy (e.g. :8092) to connect
      // to Vite's WebSocket for HMR.  Don't set hmr.host — the HMR client
      // will use the page's hostname, so it works for both localhost and
      // remote access.  clientPort tells it which port to connect to.
      hmr: {
        clientPort: parseInt(process.env.PORT || "5001"),
        protocol: "ws",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      fs: {
        allow: [
          path.resolve(__dirname, "../../public"),
          path.resolve(__dirname, "../shared"),
          path.resolve(__dirname, "../../libs"),
          path.resolve(__dirname),
        ],
      },
    },

    build: {
      outDir: "dist",
      sourcemap: isProduction ? "hidden" : "inline",
      // Disable base64 inlining of small assets so that imported file names
      // are preserved in URLs.  The Avatar component detects default photos
      // by checking whether the URL contains "default_user_photo" and renders
      // an SVG placeholder instead of the PNG.  Inlining turns the URL into a
      // data-URI which breaks this detection.
      assetsInlineLimit: 0,
      rollupOptions: {
        onwarn(warning: { code?: string; message?: string; id?: string }, warn: Function) {
          // react-virtualized ships a Flow directive that Rollup doesn't understand
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
          // sjcl optionally imports Node "crypto" for PRNG seeding;
          // it falls back to window.crypto in the browser.
          if (warning.message?.includes("externalized for browser")) return;
          // json2-mod uses eval() internally — safe, informational only
          if (
            warning.code === "EVAL" &&
            warning.id?.includes("json2-mod")
          )
            return;
          // Suppress Vite reporter warnings about modules that are both dynamically
          // and statically imported (route-level lazy loading + parent static import).
          // These are informational — they just mean those chunks won't be code-split.
          if (
            warning.message?.includes(
              "dynamic import will not move module into another chunk",
            )
          )
            return;
          warn(warning);
        },
        output: {
          entryFileNames: "static/js/[name].[hash].bundle.js",
          chunkFileNames: "static/js/[name].[hash].js",
          assetFileNames: (assetInfo: { names?: string[] }) => {
            const name = assetInfo.names?.[0] || "";
            if (name.endsWith(".css")) {
              return "static/styles/[name].[hash][extname]";
            }
            return "static/[name].[hash][extname]";
          },
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              if (id.includes("firebase")) return "vendor-firebase";
              if (id.includes("mobx")) return "vendor-mobx";
              if (
                id.includes("react-dom") ||
                id.includes("react-router") ||
                id.includes("react-i18next") ||
                id.includes("scheduler")
              )
                return "vendor-react";
              if (id.includes("styled-components")) return "vendor-styled";
              if (id.includes("lodash")) return "vendor-lodash";
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: isProduction ? "esbuild" : false,
      commonjsOptions: {
        // Handle firebase compat and other packages that use require() in ESM
        transformMixedEsModules: true,
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router",
        "mobx",
        "mobx-react",
        "styled-components",
        "i18next",
        "react-i18next",
        "axios",
        "lodash",
        "firebase/compat/app",
        "firebase/compat/remote-config",
        "firebase/compat/storage",
        "firebase/compat/database",
      ],
    },
  };
});
