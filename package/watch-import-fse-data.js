#!/usr/bin/env node

import chokidar from "chokidar";

// Internal dependencies
import { updatePartsAndTemplates } from "./update-parts-and-templates.js";
import { info } from "./utils/inform.js";

cli(process.argv.slice(2));

/**
 * Process the given cmd line arguments and start watching for the relevant zip file
 * @param {Array} args Command line arguments
 */
function cli(args) {
  const zipPath = args[0] || "edit-site-export";
  watchExportedDataZip(zipPath);
}

/**
 * Watch the given path and update ./templates and ./parts on change
 * @param {String} zipPath The path of the zip file to watch
 */
function watchExportedDataZip(zipPath) {
  chokidar.watch("*.zip").on("add", async (path) => {
    if (path.includes(zipPath)) await updatePartsAndTemplates(path);
  });

  info("Watching CWD for %s...", zipPath);
}
