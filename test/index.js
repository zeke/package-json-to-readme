var nixt = require('nixt')

describe("package-json-to-readme", function() {

  it("writes markdown", function(done) {
    nixt()
      .run('./index.js package.json')
      .stdout(/# package-json-to-readme/)
      .stdout(/npm install package-json-to-readme --global/)
      .end(done)
  })

})
