#
# Paths
#

TEST_EXEC=node_modules/.bin/hydro

#
# All
#

all: clean install test

#
# Install dependencies
#

install:
	@npm install

#
# Run the tests
#

test:
	@NODE_ENV=test $(TEST_EXEC)

#
# Clean
#

clean:
	rm -rf node_modules

#
# Run the tests on the CI server
#

test-ci: test

#
# Instructions
#

.PHONY: test
