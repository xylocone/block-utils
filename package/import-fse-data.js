#!/usr/bin/env node

cli(process.argv.slice(2));

import { updatePartsAndTemplates } from "./update-parts-and-templates.js";

/**
 * Process the command line arguments and import Site-Editor-exported data into the theme
 * @param {Array} args Command line arguments
 */
async function cli(args) {
  const zipPath = args[0] || "edit-site-export";
  await updatePartsAndTemplates(zipPath);
}
