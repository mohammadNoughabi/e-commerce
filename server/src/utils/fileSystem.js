const fs = require('fs').promises;
const path = require('path');

/**
 * FileSystem class for handling file and directory operations
 */
class FileSystem {
  /**
   * Creates a directory at the specified path
   * @param {string} dirPath - Path for the new directory
   * @returns {Promise<void>}
   * @throws {Error} If directory creation fails
   */
  async makeDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory at ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Removes a directory at the specified path
   * @param {string} dirPath - Path of the directory to remove
   * @returns {Promise<void>}
   * @throws {Error} If directory removal fails
   */
  async removeDirectory(dirPath) {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
      throw new Error(`Failed to remove directory at ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Renames a directory
   * @param {string} oldPath - Current path of the directory
   * @param {string} newPath - New path for the directory
   * @returns {Promise<void>}
   * @throws {Error} If directory renaming fails
   */
  async changeDirectoryName(oldPath, newPath) {
    try {
      await fs.rename(oldPath, newPath);
    } catch (error) {
      throw new Error(`Failed to rename directory from ${oldPath} to ${newPath}: ${error.message}`);
    }
  }

  /**
   * Moves a file from one directory to another
   * @param {string} sourcePath - Path to the source file
   * @param {string} destinationPath - Path to the destination directory or file
   * @returns {Promise<void>}
   * @throws {Error} If file moving fails
   */
  async moveFile(sourcePath, destinationPath) {
    try {
      const fileName = path.basename(sourcePath);
      const destPath = path.extname(destinationPath) ? destinationPath : path.join(destinationPath, fileName);
      await fs.rename(sourcePath, destPath);
    } catch (error) {
      throw new Error(`Failed to move file from ${sourcePath} to ${destinationPath}: ${error.message}`);
    }
  }

  /**
   * Checks if a file or directory exists
   * @param {string} itemPath - Path to the file or directory
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(itemPath) {
    try {
      await fs.access(itemPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reads the contents of a file
   * @param {string} filePath - Path to the file
   * @param {string} [encoding='utf8'] - File encoding
   * @returns {Promise<string|Buffer>} File contents
   * @throws {Error} If file reading fails
   */
  async readFile(filePath, encoding = 'utf8') {
    try {
      return await fs.readFile(filePath, encoding);
    } catch (error) {
      throw new Error(`Failed to read file at ${filePath}: ${error.message}`);
    }
  }

  /**
   * Writes content to a file
   * @param {string} filePath - Path to the file
   * @param {string|Buffer} data - Data to write
   * @param {string} [encoding='utf8'] - File encoding
   * @returns {Promise<void>}
   * @throws {Error} If file writing fails
   */
  async writeFile(filePath, data, encoding = 'utf8') {
    try {
      await fs.writeFile(filePath, data, encoding);
    } catch (error) {
      throw new Error(`Failed to write file at ${filePath}: ${error.message}`);
    }
  }

  /**
   * Lists files and directories in a directory
   * @param {string} dirPath - Path to the directory
   * @param {boolean} [fullPath=false] - Return full paths instead of names
   * @returns {Promise<string[]>} Array of file/directory names or paths
   * @throws {Error} If directory listing fails
   */
  async listDirectory(dirPath, fullPath = false) {
    try {
      const items = await fs.readdir(dirPath);
      return fullPath ? items.map(item => path.join(dirPath, item)) : items;
    } catch (error) {
      throw new Error(`Failed to list directory at ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Checks if a path is a directory
   * @param {string} itemPath - Path to check
   * @returns {Promise<boolean>} True if directory, false otherwise
   */
  async isDirectory(itemPath) {
    try {
      const stats = await fs.stat(itemPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Checks if a path is a file
   * @param {string} itemPath - Path to check
   * @returns {Promise<boolean>} True if file, false otherwise
   */
  async isFile(itemPath) {
    try {
      const stats = await fs.stat(itemPath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * Copies a file to a new location
   * @param {string} sourcePath - Path to the source file
   * @param {string} destinationPath - Path to the destination directory or file
   * @returns {Promise<void>}
   * @throws {Error} If file copying fails
   */
  async copyFile(sourcePath, destinationPath) {
    try {
      const fileName = path.basename(sourcePath);
      const destPath = path.extname(destinationPath) ? destinationPath : path.join(destinationPath, fileName);
      await fs.copyFile(sourcePath, destPath);
    } catch (error) {
      throw new Error(`Failed to copy file from ${sourcePath} to ${destinationPath}: ${error.message}`);
    }
  }

  /**
   * Gets file or directory stats
   * @param {string} itemPath - Path to the file or directory
   * @returns {Promise<fs.Stats>} Stats object
   * @throws {Error} If getting stats fails
   */
  async getStats(itemPath) {
    try {
      return await fs.stat(itemPath);
    } catch (error) {
      throw new Error(`Failed to get stats for ${itemPath}: ${error.message}`);
    }
  }
}

module.exports = FileSystem;