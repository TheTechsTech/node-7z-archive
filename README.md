node-7z-archive
=======

[![NPM](https://nodei.co/npm/node-7z-archive.png)](https://nodei.co/npm/node-7z-archive/)

[![Dependencies Status][david-image]][david-url] [![Node.js CI](https://github.com/techno-express/node-7z-archive/workflows/Node.js%20CI/badge.svg)](https://github.com/techno-express/node-7z-archive) [![codecov](https://codecov.io/gh/techno-express/node-7z-archive/branch/master/graph/badge.svg?token=WGQxlF48sk)](https://codecov.io/gh/techno-express/node-7z-archive) [![Maintainability][codeclimate-image]][codeclimate-url][![Release][npm-image]][npm-url]

> ESM front-end to 7-Zip, featuring alternative full 7z CLI tool, binaries for **Linux**, **Windows**, **Mac OSX**, seamlessly create 7zip SFX self extracting archives targeting different platforms.

Usage
-----

This library use *Promises*, it's API is consistent with standard use:

```js
import { fullArchive } from 'node-7z-archive';

fullArchive('myArchive.7z', 'destination', { p: 'myPassword' } /* 7z options/switches */)
// Equivalent to `on('data', function (files) { // ... });`
.progress(function (files) {
  console.log('Some files are extracted: %s', files);
});

// When all is done
.then(function () {
  console.log('Extracting done!');
});

// On error
.catch(function (err) {
  console.error(err);
});
```

__How to create Sfx - Self Extracting Archives.__

Executables will be built using 7-zip version _19.00_ on **Windows OS** for Windows targets.
**Linux** and **Apple macOS** will use 7-zip version _16.04_ for all targets.

import { createWindowsSfx, createLinuxSfx, createMacSfx } from 'node-7z-archive';

- **createWindowsSfx**(name, files, destination, options, type);

- **createLinuxSfx**(name, files, destination, options);

- **createMacSfx**(name, files, destination, options);

Each will in turn call:
**createSfx**(name, files, destination, options, type, platform, extension) as:

- `name` Application name.
- `files` Files to add.
- `destination` Application root for the `SfxPackages` directory, will default to package root.
  - All Sfx package archives are stored in the **created** `SfxPackages` directory.
  - The `destination` directory must already exists.

- `options` For installer config file and 7-zip switch options.
  * `{`
  * `title:` - Window title message, Default "`name` installation package created on `Current running platform OS`"
  * `beginPrompt:` - Begin Prompt message, Default "Do you want to install `name`?""
  * `installPath:` - "path_to_extract", Sets the extraction path. The extraction folder will not be deleted after the extraction.
  * `progress:` - Value can be "yes" or "no". Default value is "yes".
  * `runProgram:` - Command for executing. Default value is "setup.exe".
  * Substring `% % T` will be replaced with path to temporary folder,
  * where files were extracted
  * `directory:` - Directory prefix for `RunProgram`. Default value is `.\`
  * `executeFile:` Name of file for executing
  * `executeParameters:` Parameters for `ExecuteFile`
  * `}`

 * `type` Application type `gui` or `console`. Default `gui`. Only `console` possible on **Linux** and **Mac** OS.
 * `platform` What platform application targeting? Either `win32`, `darwin`, or `linux`.
 * `extension` Binary extension name.


Installation
------------

This package will download the 7zip binaries at install time. Host system does not need to have 7zip installed or in PATH.

The binaries will be downloaded from:
> On Linux - https://sourceforge.net/projects/p7zip

> On Windows - https://www.7-zip.org/download.html

> On Mac OSX - https://rudix.org/

```shell
npm install --save node-7z-archive
```

CLI
---

For using full **7zip** from command line without installation package.

```shell
npm install -g node-7z-archive
```

Will have **`createArchive`, `deleteArchive`, `extractArchive`, `fullArchive`, `listArchive`, `renameArchive`, `testArchive`, `updateArchive`** available globally. To always see available commands type:

```shell
7zip
```

Outputs:

```md
Full 7zip Console Commands.

 ESM front-end to 7-Zip, featuring alternative full 7z CLI tools, binaries for Linux, Windows, Mac OSX, seamlessly create 7zip SFX self extracting archives targeting different platforms.

 **Commands**

 Adds files to archive.
 Usage: `createArchive` archivePath files ...options

 Deletes files from archive.
 Usage: `deleteArchive` archivePath files ...options

 Extracts files from an archive to the current directory or to the output directory.
 Usage: `extractArchive` archivePath destination ...options

 Extracts files from an archive with their full paths in the current directory, or in an output directory
 Usage: `fullArchive` archivePath destination ...options

 Lists contents of archive.
 Usage: `listArchive` archivePath ...options

 Renames files in archive.
 Usage: `renameArchive` archivePath file pairs ...options

 Tests archive files.
 Usage: `testArchive` archivePath ...options

 Update older files in the archive and add files that are not already in the archive.
 Usage: `updateArchive` archivePath files ...options
```

> ____This package is a rewrite of [node-7z-forall](https://github.com/techno-express/node-7z-forall)____. The original author has removed the version it was a fork of [node-7z](https://github.com/quentinrossetti/node-7z). The author's current version has over `600` dependency tree without dev. This package dependency is `130` with dev.

API
---

> See the [7-Zip documentation](http://sevenzip.sourceforge.jp/chm/cmdline/index.htm) Or [7 Zip Command Line Examples](https://www.dotnetperls.com/7-zip-examples)
> for the full list of usages and options (**switches**).

> The type of the list of files can be either *String* or *Array*.

**import { SevenZip } from 'node-7z-archive';**

*By method name:*
**import { createArchive, deleteArchive, extractArchive, fullArchive, listArchive, renameArchive, testArchive, updateArchive } from 'node-7z-archive';**

_____Options:_____ 7-Zip Switches, use without initial `'-'`.

```md
  -- : Stop switches and @listfile parsing
  -ai[r[-|0]]{@listfile|!wildcard} : Include archives
  -ax[r[-|0]]{@listfile|!wildcard} : eXclude archives
  -ao{a|s|t|u} : set Overwrite mode
  -an : disable archive_name field
  -bb[0-3] : set output log level
  -bd : disable progress indicator
  -bs{o|e|p}{0|1|2} : set output stream for output/error/progress line
  -bt : show execution time statistics
  -i[r[-|0]]{@listfile|!wildcard} : Include filenames
  -m{Parameters} : set compression Method
    -mmt[N] : set number of CPU threads
    -mx[N] : set compression level: -mx1 (fastest) ... -mx9 (ultra)
  -o{Directory} : set Output directory
  -p{Password} : set Password
  -r[-|0] : Recurse subdirectories
  -sa{a|e|s} : set Archive name mode
  -scc{UTF-8|WIN|DOS} : set charset for console input/output
  -scs{UTF-8|UTF-16LE|UTF-16BE|WIN|DOS|{id}} : set charset for list files
  -scrc[CRC32|CRC64|SHA1|SHA256|*] : set hash function for x, e, h commands
  -sdel : delete files after compression
  -seml[.] : send archive by email
  -sfx[{name}] : Create SFX archive
  -si[{name}] : read data from stdin
  -slp : set Large Pages mode
  -slt : show technical information for l (List) command
  -snh : store hard links as links
  -snl : store symbolic links as links
  -sni : store NT security information
  -sns[-] : store NTFS alternate streams
  -so : write data to stdout
  -spd : disable wildcard matching for file names
  -spe : eliminate duplication of root folder for extract command
  -spf : use fully qualified file paths
  -ssc[-] : set sensitive case mode
  -sse : stop archive creating, if it can't open some input file
  -ssw : compress shared files
  -stl : set archive timestamp from the most recently modified file
  -stm{HexMask} : set CPU thread affinity mask (hexadecimal number)
  -stx{Type} : exclude archive type
  -t{Type} : Set type of archive
  -u[-][p#][q#][r#][x#][y#][z#][!newArchiveName] : Update options
  -v{Size}[b|k|m|g] : Create volumes
  -w[{path}] : assign Work directory. Empty path means a temporary directory
  -x[r[-|0]]{@listfile|!wildcard} : eXclude filenames
  -y : assume Yes on all queries
```

### `createArchive`(filepath, files, options)

**Arguments**
 * `filepath` Path to the archive you want to create.
 * `files` The file list to add.
 * `options` An object of options (7-Zip switches).

**Progress**
 * `files` A array of all the added files. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.

### `deleteArchive`(filepath, files, options)

**Arguments**
 * `filepath` Path to the archive you want to delete files from.
 * `files` The file list to delete.
 * `options` An object of options (7-Zip switches).

**Error**
 * `err` An Error object.

### `extractArchive`(filepath, dest, options)

**Arguments**
 * `filepath` The path to the archive you want to extract.
 * `dest` Where to extract the archive.
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/` character is used as a path separator on every platform.

**Error**
 * `err` An Error object.

### `fullArchive`(filepath, dest, options)

**Arguments**
 * `filepath` The path to the archive you want to extract.
 * `dest` Where to extract with full paths, the archive (creates folders for you).
 * `options` An object of options.

**Progress**
 * `files` A array of all the extracted files *AND* directories. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.

### `listArchive`(filepath, options)

**Arguments**
 * `filepath` The path to the archive you want to analyze, list contents of archive.
 * `options` An object of options.

**Progress**
 * `files` A array of objects of all the extracted files *AND* directories.
   The `/` character is used as a path separator on every platform. Object's
   properties are: `date`, `attr`, `size` and `name`.

**Then - Resolved**
 * `spec` An object of tech spec about the archive. Properties are: `path`,
   `type`, `method`, `physicalSize` and `headersSize` (Some of them may be
   missing with non-7z archives).

**Error**
 * `err` An Error object.

### `renameArchive`(filepath, files, options)

**Arguments**
 * `filepath` The path to the archive that has the file to rename.
 * `files` The file list in pairs to rename in archive.
 * `options` An object of options.

**Progress**
 * `files` A array of files renamed.

**Error**
 * `err` An Error object.

### `testArchive`(filepath, options)

**Arguments**
 * `filepath` The path to the archive you want to analyze, test integrity of archive.
 * `options` An object of options.

**Progress**
 * `files` A array of all the tested files. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.

### `updateArchive`(filepath, files, options)

**Arguments**
 * `filepath` Path to the archive you want to update.
 * `files` The file list to update.
 * `options` An object of options (7-Zip switches).

**Progress**
 * `files` A array of all the updated files. The `/`
   character is used as a path separator on every platform.

**Error**
 * `err` An Error object.


Advanced usage
--------------

### Compression method

With the `7z` binary compression is made like that:

```shell
# adds *.exe and *.dll files to solid archive archive.7z using LZMA method
# with 2 MB dictionary and BCJ filter.
7z a archive.7z *.exe -m0=BCJ -m1=LZMA:d=21
```

With **node-7z-archive** you can translate it like that:

```js
import { createArchive } from 'node-7z-archive';

createArchive('archive.7z', '*.exe', {
  m0: '=BCJ',
  m1: '=LZMA:d=21'
})
.then(function () {
  // Do stuff...
});
```

### createArchive, deleteArchive and updateArchive multiple files

When adding, deleting or updating archives you can pass either a string or an array as second parameter (the `files` parameter).

```js
import { deleteArchive } from 'node-7z-archive';

deleteArchive('bigArchive.7z', [ 'file1', 'file2' ])
.then(function () {
  // Do stuff...
});
```

### Wildcards

You can extract with wildcards to specify one or more file extensions. To do
this add a `wildcards` attribute to the `options` object. The `wildcard`
attribute takes an *Array* as value. In this array each item is a wildcard.

```js
import { fullArchive } from 'node-7z-archive';

fullArchive('archive.zip', 'destination/', {
  wildcards: [ '*.txt', '*.md' ], // extract all text and Markdown files
  r: true // in each subfolder too
})
.progress(function (files) {
  // Do stuff with files...
})
.then(function () {
  // Do stuff...
});
```

Note that the `r` (for recursive) attribute is passed in this example.

### Raw inputs

Sometimes you just want to use the lib as the original command line. For
instance you want to apply to switches with different values (e.g.:
`-i!*.jpg -i!*.png` to target only two types of extensions).

In such cases the default behavior of the `options` argument is not enough. You
can use the custom `raw` key in your `options` object and pass it an *Array* of
values.

```js
import { listArchive } from 'node-7z-archive';

listArchive('archive.zip', {
  raw: [ '-i!*.jpg', '-i!*.png' ], // only images
})
.progress(function (files) {
  // Do stuff with files...
})
.then(function () {
  // Do stuff...
});
```

***

[david-url]: https://david-dm.org/techno-express/node-7z-archive
[david-image]: http://img.shields.io/david/techno-express/node-7z-archive.svg
[codeclimate-url]: https://codeclimate.com/github/techno-express/node-7z-archive/maintainability
[codeclimate-image]: https://api.codeclimate.com/v1/badges/28d7f386668a12f3ca84/maintainability
[npm-url]: https://www.npmjs.org/package/node-7z-archive
[npm-image]: http://img.shields.io/npm/v/node-7z-archive.svg
