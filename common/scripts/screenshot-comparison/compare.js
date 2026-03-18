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

/**
 * Screenshot Comparison Tool
 *
 * Compares a design image against a live page screenshot and highlights differences.
 *
 * Before using this script:
 * 1. Install dependencies:  npm install && npx playwright install chromium
 * 2. Copy .env.example to .env and fill in your values:
 *    - ASC_AUTH_KEY  — auth cookie
 *    - TARGET_URL    — full URL of the page to compare
 *    - BANNER_KEYS   — (optional) JSON array of banner keys to suppress
 * 3. Export the frame from Figma and place it into the ./images/ folder as design.png.
 * 4. Run:  npm run compare
 *
 * Output files (saved to ./images/):
 *   - page.png  — screenshot of the live page
 *   - diff.png  — visual diff highlighting mismatched pixels
 */

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const { chromium } = require("playwright");
const fs = require("fs");
const pixelmatch = require("pixelmatch").default;
const PNG = require("pngjs").PNG;

const IMAGES_DIR = path.resolve(__dirname, "images");

const ASC_AUTH_KEY = process.env.ASC_AUTH_KEY;
const TARGET_URL = process.env.TARGET_URL;
const DEFAULT_BANNER_KEYS = ["user-quota-limit", "confirm-email", "Docs_9_3"];
const BANNER_KEYS = process.env.BANNER_KEYS
  ? JSON.parse(process.env.BANNER_KEYS)
  : DEFAULT_BANNER_KEYS;

function validateConfig() {
  if (!ASC_AUTH_KEY) {
    console.log("ASC_AUTH_KEY is not set!");
    console.log("Copy .env.example to .env and fill in your auth cookie.\n");
    process.exit(1);
  }

  if (!TARGET_URL) {
    console.log("TARGET_URL is not set!");
    console.log("Copy .env.example to .env and fill in your values.\n");
    process.exit(1);
  }

  const designPath = path.join(IMAGES_DIR, "design.png");
  if (!fs.existsSync(designPath)) {
    console.log("File images/design.png not found!");
    process.exit(1);
  }
}

async function run() {
  console.log("Starting screenshot comparison...\n");

  validateConfig();

  const designPath = path.join(IMAGES_DIR, "design.png");
  const pagePath = path.join(IMAGES_DIR, "page.png");
  const diffPath = path.join(IMAGES_DIR, "diff.png");

  // Read dimensions from design.png
  const designImage = PNG.sync.read(fs.readFileSync(designPath));
  const { width, height } = designImage;
  console.log(`Size of design.png: ${width}x${height}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
  });

  // Extract domain from TARGET_URL for cookie
  const urlObj = new URL(TARGET_URL);

  await context.addCookies([
    {
      name: "asc_auth_key",
      value: ASC_AUTH_KEY,
      domain: urlObj.hostname,
      path: "/",
      httpOnly: true,
      secure: urlObj.protocol === "https:",
    },
  ]);

  const page = await context.newPage();

  // First open the page to set localStorage
  await page.goto(TARGET_URL, { waitUntil: "domcontentloaded" });

  // Set localStorage to hide banners
  await page.evaluate((keys) => {
    localStorage.setItem("barClose", JSON.stringify(keys));
  }, BANNER_KEYS);

  try {
    await page.goto(TARGET_URL, { waitUntil: "networkidle" });
  } catch (err) {
    console.log("Failed to open the page");
    console.log("Make sure the server is running and TARGET_URL is correct.\n");
    await browser.close();
    process.exit(1);
  }

  await page.screenshot({ path: pagePath });
  await browser.close();

  const img2 = PNG.sync.read(fs.readFileSync(pagePath));

  const diff = new PNG({ width, height });

  const diffPixels = pixelmatch(
    designImage.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const diffPercent = ((diffPixels / totalPixels) * 100).toFixed(2);

  console.log("\nResults:");
  console.log("─".repeat(40));
  console.log(`Size:              ${width}x${height}`);
  console.log(`Total pixels:      ${totalPixels.toLocaleString()}`);
  console.log(`Differences:       ${diffPixels.toLocaleString()}`);
  console.log(`Diff percentage:   ${diffPercent}%`);
  console.log("─".repeat(40));

  if (parseFloat(diffPercent) > 1) {
    console.log("\nLayout mismatch detected");
    console.log(`Check ${diffPath} to visualize the differences\n`);
    process.exit(1);
  } else {
    console.log("\nLayout matches design");
    console.log("Differences are within acceptable range (< 1%)\n");
  }
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
