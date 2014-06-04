var mocha = require("mocha")
var assert = require("assert")
var gh = require("../index")

describe("github-url-to-object", function() {

  describe("properties", function() {
    var obj

    before(function(){
      obj = gh("git://github.com/foo-master/party-time.git")
    })

    it("user", function() {
      assert.equal(obj.user, "foo-master")
    })

    it("repo", function() {
      assert.equal(obj.repo, "party-time")
    })

    it("tarball_url", function() {
      assert.equal(obj.tarball_url, "https://api.github.com/repos/foo-master/party-time/tarball")
    })

    it("https_url", function() {
      assert.equal(obj.https_url, "https://github.com/foo-master/party-time")
    })

    it("travis_url", function() {
      assert.equal(obj.travis_url, "https://travis-ci.org/foo-master/party-time")
    })

  })

  it("handles URLs without .git at the end", function() {
    var obj = gh("https://github.com/zeke/outlet")
    assert.equal(obj.user, 'zeke')
    assert.equal(obj.repo, 'outlet')
  })

  it("handles http URLs", function() {
    var obj = gh("http://github.com/zeke/outlet.git")
    assert.equal(obj.user, 'zeke')
    assert.equal(obj.repo, 'outlet')
  })

  it("handles https URLs", function() {
    var obj = gh("https://github.com/zeke/outlet.git")
    assert.equal(obj.user, 'zeke')
    assert.equal(obj.repo, 'outlet')
  })

  it("handles git URLs", function() {
    var obj = gh("git://github.com/foo/bar.git")
    assert.equal(obj.user, 'foo')
    assert.equal(obj.repo, 'bar')
  })

  it("handles shorthand user/repo paths", function() {
    var obj = gh("foo/bar")
    assert.equal(obj.user, 'foo')
    assert.equal(obj.repo, 'bar')
  })

  it("handles git@ URLs", function() {
    var obj = gh("git@github.com:heroku/heroku-flags.git")
    assert.equal(obj.user, 'heroku')
    assert.equal(obj.repo, 'heroku-flags')
  })

  it("returns null if url is falsy", function() {
    assert.equal(gh(), null)
    assert.equal(gh(null), null)
    assert.equal(gh(undefined), null)
    assert.equal(gh(""), null)
  })

  it("returns null for non-github URLs", function() {
    var obj = gh("https://bitbucket.com/other/thing")
    assert.equal(obj, null)
  })

})
