# Write to stdout
readme package.json

# Pipe output into a new file
readme package.json > README.md

# Add a Travis badge
readme package.json --travis > README.md

# If your package has an example.sh or example.js file, it will be used to
# generate a usage section like this one.

# If you use require("./") in example.js, the relative path will be replaced
# with the package name.
