var nixt = require('nixt')

describe("readme", function() {

  it("writes markdown to stdout", function(done) {
    nixt()
      .run('./index.js test/fixtures/global.json')
      .stdout(/# sample/)
      .end(done)
  })

  it("adds --global install flag if preferGlobal is true", function(done) {
    nixt()
      .run('./index.js test/fixtures/global.json')
      .stdout(/npm install sample --global/)
      .end(done)
  })

  it("adds --save install flag if preferGlobal is falsy", function(done) {
    nixt()
      .run('./index.js test/fixtures/local.json')
      .stdout(/npm install sample --save/)
      .end(done)
  })

  it("supports a --travis flag", function(done) {
    nixt()
      .run('./index.js test/fixtures/local.json --travis')
      .stdout(/travis-ci/)
      .end(done)
  })

  it("fails with message if --travis flag is set and repository.url is missing", function(done) {
    nixt()
      .run('./index.js test/fixtures/missing-travis-stuff.json --travis')
      .stderr(/must be a GitHub repository URL/)
      .end(done)
  })

  it("fails with message if package.json is invalid", function(done) {
    nixt()
      .run('./index.js test/fixtures/invalid.json')
      .stderr(/Invalid JSON file/)
      .end(done)
  })

})
