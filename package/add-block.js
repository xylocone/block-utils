#!/usr/bin/env node

import path, { basename, join } from "path";
import url from "url";
import { execaCommand } from "execa";
import Scaffold from "scaffold-generator";
import mustache from "mustache";
import { capitalCase } from "change-case";
import { rename, readdir } from "fs/promises";

// Internal dependencies
import { askUntilAnswered } from "./utils/askUntilAnswered.js";
import { askQuestions } from "./utils/askQuestions.js";
import { error, success } from "./utils/inform.js";

const TARGET_DIRECTORY_RELATIVE_PATH = join("blocks", "src");

let options = {};

cli(process.argv.slice(2));

const defaultOptions = {
  namespace: basename(process.cwd()),
  title: "My Awesome Block",
  description: "",
  icon: "smiley",
  templateDirectory: path.resolve(
    url.fileURLToPath(import.meta.url),
    "../templates/block"
  ),
  targetDirectory: path.join(process.cwd(), TARGET_DIRECTORY_RELATIVE_PATH),
};

/**
 * Process the command line arguments, prompt user for input and create a new block
 * @param {Array} args Command line arguments
 */
async function cli(args) {
  try {
    await assignOptions(args);
    await copyTemplateFiles();
    await renameCopiedFiles();

    success("Block successfully added.");
  } catch (e) {
    error(`Block could not be added.`);
  }
}

/**
 * Using command line arguments and prompting user to give input, map input to options
 * @param {array} args Command line arguments
 */
async function assignOptions(args) {
  options.slug =
    args[0] ||
    (await askUntilAnswered({
      name: "slug",
      message: "Block slug: ",
    }));

  const questions = [
    {
      name: "title",
      message: "Title: ",
      default: capitalCase(options.slug),
    },
    {
      name: "namespace",
      message: "namespace: ",
      default: defaultOptions.namespace,
    },
    {
      name: "description",
      message: "Description: ",
      default: defaultOptions.description,
    },
    {
      name: "icon",
      message: "Icon: ",
      default: defaultOptions.icon,
    },
  ];

  const answers = await askQuestions(questions);

  // For each defaultOption, if the corresponding answer is empty, use the defaultOption
  options = Object.assign(
    {},
    options,
    ...Object.keys(defaultOptions).map((key) => ({
      [key]: answers[key] || defaultOptions[key],
    }))
  );
}

/**
 * Copy template files from the ./package/templates/block dir into <calling process' cwd>/blocks/src
 */
async function copyTemplateFiles() {
  try {
    await execaCommand(`mkdir ${options.slug}`, {
      cwd: options.targetDirectory,
    });
    await new Scaffold({
      data: options,
      render: mustache.render,
    }).copy(
      options.templateDirectory,
      path.join(options.targetDirectory, options.slug)
    );
  } catch (e) {
    error(
      "Could not copy template files to %s. Make sure you have a %s directory at your project's root.",
      TARGET_DIRECTORY_RELATIVE_PATH,
      TARGET_DIRECTORY_RELATIVE_PATH
    );
    throw new Error();
  }
}

/**
 * Rename the copied template files by stripping away their ending .mustache extension
 */
async function renameCopiedFiles() {
  const blocksDir = join(
    process.cwd(),
    TARGET_DIRECTORY_RELATIVE_PATH,
    options.slug
  );

  const copiedFiles = await readdir(blocksDir);
  for (const copiedFile of copiedFiles) {
    let oldPath = join(blocksDir, copiedFile);
    let newPath = oldPath.replace(/(.+)\.mustache$/, "$1");
    await rename(oldPath, newPath);
  }
}
