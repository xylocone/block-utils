import { rm } from "fs/promises";

/**
 * Delete a file or a directory
 * @param {String} path Path of the file or dir to be deleted
 */
export async function deletePath(path) {
  await rm(path, { recursive: true, force: true });
}
