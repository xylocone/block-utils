#!/usr/bin/env node

import zipLib from "zip-lib";
import { basename, extname } from "path";

// Internal dependencies
import { pathExists } from "./utils/pathExists.js";
import { error, info, pathDoesNotExist, success } from "./utils/inform.js";

cli(process.argv.slice(2));

/**
 * Process the command line arguments and export the theme files and dirs to a zip
 * @param {Array} args Command line arguments
 */
async function cli(args) {
  let themeSlug = basename(process.cwd());
  let zipFileName = (args[0] || themeSlug) + ".zip";

  info(`Packaging the theme into %s...`, zipFileName);
  await packageFilesAndFolders(zipFileName);
}

/**
 * Add files and folders to be packaged and package them into a zip
 * @param {String} zipFileName File name of the exported zip
 */
async function packageFilesAndFolders(zipFileName) {
  const zip = new zipLib.Zip();

  const itemsToAdd = [
    "index.php",
    "style.css",
    "blocks/build",
    "gutenberg_utils",
    "functions.php",
    "gutenberg.php",
    "templates",
    "parts",
  ];

  for (let item of itemsToAdd) await addPathToArchive(zip, item);

  try {
    await zip.archive(`./${zipFileName}`);
    success("Exported theme to %s!", zipFileName);
  } catch (e) {
    error("Could not export the theme.");
    console.trace(e);
  }
}

/**
 * Add a path to a Zip instance
 * @param {Zip} zipInstance The zip object to which the path is to be added
 * @param {String} path Path to be added
 */
async function addPathToArchive(zipInstance, path) {
  if (await pathExists(path)) {
    if (!extname(path)) {
      // path is a directory
      zipInstance.addFile(path, path);
      zipInstance.addFolder(path, path);
    } else {
      // path is a file
      zipInstance.addFile(path, path);
    }
  } else {
    pathDoesNotExist(path, true);
  }
}
