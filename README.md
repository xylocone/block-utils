## @xylocone/block-utils

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

- Exposes binaries that help in developing Gutenberg blocks and Block themes.
- Conceived as a dependency for `@xylocone/create-block-theme` package, but can also be used independently with a file structure similar to `create-block-theme`'s.

## Installation

```bash
npm install -g @xylocone/block-utils
```

## Exposed Binaries

1. `add-block` &ndash; Add a block to the `<CWD>/blocks/src` directory.

   Syntax:

   ```
   add-block [<block-slug>]
   ```

   Usage:

   | ![Using `add-block`](https://xylocone.files.wordpress.com/2022/05/add-block-render.gif) |
   | --------------------------------------------------------------------------------------- |
   | Using `add-block`                                                                       |

2. `import-fse-data` &ndash; Update theme's `templates` and `parts` if a zip file whose name includes <i>`edit-site-export`</i> is present in the CWD.

   Syntax:

   ```
   import-fse-data [<alternative-name-to-look-for>]
   ```

3. `watch-import-fse-data` &ndash; Update theme's `templates` and `parts` whenever a zip file whose name includes <i>`edit-site-export`</i> is dropped into the CWD.

   Syntax:

   ```
   watch-import-fse-data [<alternative-name-to-look-for>]
   ```

4. `export-theme-zip` &ndash; Export the CWD as a ready-to-install theme zip.

   Syntax:

   ```
   export-theme-zip
   ```

## License

[MIT](https://choosealicense.com/licenses/mit/)
