declare module 'node-7z-archive';
declare class SevenZip {
  constructor() { }
}

export = SevenZip;

/**
 * Create/add content to an archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string|array} Files to add.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param useBinary {string} binary to use.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Listed files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export function createArchive(filepath: string, files: string | array, options?: object, useBinary?: string, override?: boolean): Promise<any>;

/**
 * Delete content from an archive.
 *
 * @param filepath {string} Path to the archive.
 * @param files {string|array} Files to remove.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param useBinary {string} binary to use.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export function deleteArchive(
  filepath: string,
  files: string | array,
  options?: object,
  useBinary?: string,
  override?: boolean
): Promise<any>;

/**
 * Extract an archive.
 *
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param options {Object} An object of acceptable 7-zip switch options.
 * @param useBinary {string} binary to use.
 * @param override {boolean} should binary directory change?
 *
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 *
 * @returns {Promise} Promise
 */
export function extractArchive(
  filepath: string,
  dest: string | array,
  options?: object,
  useBinary?: string,
  override?: boolean
): Promise<any>;

export function fullArchive(filepath: string, files: string | array, options?: object, useBinary?: string, override?: boolean): Promise<any>;
export function listArchive(filepath: string, files: string | array, options?: object, useBinary?: string, override?: boolean): Promise<any>;
export function renameArchive(filepath: string, files: string | array, options?: object, useBinary?: string, override?: boolean): Promise<any>;
export function testArchive(filepath: string, files: string | array, options?: object, useBinary?: string, override?: boolean): Promise<any>;
export function updateArchive(filepath: string, files: string | array, options?: object, useBinary?: string, override?: boolean): Promise<any>;

export function createWindowsSfx(name: string, files: string | array, destination?: string, options?: object, type?: string): Promise<any>;

export function createLinuxSfx(name: string, files: string | array, destination?: string, options?: object): Promise<any>;

export function createMacSfx(name: string, files: string | array, destination?: string, options?: object): Promise<any>;
