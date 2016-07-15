If your package has an `usage.md` file, it will be used to
generate a usage section like this one. If it also contains
 an `example.sh` or `example.js` file, it will also be added.

If your `example.js` has a `require("./")` statement, the relative path will be
replaced with the package name.
