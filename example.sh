# Write to stdout
readme package.json

# Pipe output into a new file
readme package.json > README.md

# Add a Travis badge
readme package.json --travis

# Run tests and add their output
readme package.json --tests

# Do it all
readme package.json --tests --travis > README.md
