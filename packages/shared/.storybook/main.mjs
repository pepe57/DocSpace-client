// This file has been automatically migrated to valid ESM format by Storybook.
import { dirname, join } from "path";
import { createRequire } from "module";
import remarkGfm from "remark-gfm";

const require = createRequire(import.meta.url);

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
export default {
  stories: [
    // "../all/all.stories.js",
    // default page
    "../**/*.stories.@(js|jsx|ts|tsx|mdx)", //"../**/*.stories.@(js|mdx)",
  ],

  staticDirs: ["../../../public", "../__mocks__/storybook"],

  addons: [
    {
      name: getAbsolutePath("@storybook/addon-docs"),
      options: {
        configureJSX: true,
        babelOptions: {
          plugins: [
            [
              "@babel/plugin-transform-private-property-in-object",
              {
                loose: true,
              },
            ],
          ],
        },
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    getAbsolutePath("@vueless/storybook-dark-mode"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {},

  babel: async (options) => {
    const presets = Array.isArray(options.presets) ? [...options.presets] : [];
    presets.push([
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ]);

    return {
      ...options,
      presets,
    };
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: false,
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },

  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: require.resolve("path-browserify"),
    };

    return config;
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
