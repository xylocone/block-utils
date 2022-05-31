import { Unzip } from "zip-lib";
import { join } from "path";
import { cp } from "fs/promises";

// Internal dependencies
import { pathExists } from "./utils/pathExists.js";
import { deletePath } from "./utils/deletePath.js";
import { pathDoesNotExist, success, error, warning } from "./utils/inform.js";

const targetPath = `__temp_dir__${Date.now()}`; // temp dir to hold unzipped data

/**
 * Update the theme's ./parts and ./templates using the exported data in the given .zip file
 * @param {String} zipPath Path of the zip file using which parts and templates are to be updated
 */
export async function updatePartsAndTemplates(zipPath) {
  zipPath = zipPath.endsWith(".zip") ? zipPath : `${zipPath}.zip`;
  try {
    if (await pathExists(zipPath)) {
      await unzipData(zipPath);
      await moveData(zipPath);
      success(
        "Imported Site-Editor-exported templates and parts into the theme."
      );
    } else {
      pathDoesNotExist(zipPath);
    }
  } catch (e) {
    error(
      "Could not import Site-Editor-exported templates and parts into the theme."
    );
  }
}

/**
 * Extract Site-Editor-exported data from the zip file at the given path
 * @param {String} zipPath Path of the zip file from which the Site Editor data is to be extracted
 */
async function unzipData(zipPath) {
  try {
    await new Unzip().extract(zipPath, targetPath);
  } catch (e) {
    error("Could not unzip %s.", [zipPath]);
    throw new Error();
  }
}

/**
 * Copy the Site-Editor-exported data to ./templates and ./parts
 * @param {String} zipPath Path of the zip file from which the data was extracted
 */
async function moveData(zipPath) {
  try {
    const themeDirExists = await pathExists(join(targetPath, "theme"));
    const templatesDirExists = await pathExists(
      join(targetPath, "theme", "templates")
    );
    const partsDirExists = await pathExists(join(targetPath, "theme", "parts"));

    if (themeDirExists && templatesDirExists && partsDirExists) {
      // If the zip file is a legitimate Site Editor export

      // Delete the already existing templates and parts dirs in the root of the project
      if (await pathExists("templates")) await deletePath("templates");
      if (await pathExists("parts")) await deletePath("parts");

      // Recursively copy all the unzipped files into the root of the project
      await cp(join(targetPath, "theme"), "./", {
        recursive: true,
        force: true,
      });

      await deletePath(zipPath); // Delete the zip
    } else {
      // If it's not Site-Editor-exported data but just a file with a similar name

      error("%s is not a valid Site Editor export.", [zipPath]);

      throw new Error();
    }
  } catch (e) {
    error("Unable to update parts and templates.");
    throw new Error();
  } finally {
    // Cleanup
    await deletePath(targetPath); // Delete the temporary dir
  }
}
