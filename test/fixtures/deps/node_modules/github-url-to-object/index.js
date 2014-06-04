var url = require('url')
var isUrl = require('is-url')

module.exports = function(repo_url) {

  if (!repo_url) return null

  // bail if given a non-github URL
  if (isUrl(repo_url) && url.parse(repo_url).hostname != "github.com") return null

  var re = /^(?:https?:\/\/|git:\/\/)?(?:[^@]+@)?(gist.github.com|github.com)[:\/]([^\/]+\/[^\/]+?|[0-9]+)$/
  var match = re.exec(repo_url.replace(/\.git$/, ''));

  // support shorthand URLs
  var parts = match ? match[2].split('/') : repo_url.split('/')

  var obj = {user: parts[0], repo: parts[1]}

  obj.tarball_url = "https://api.github.com/repos/" + obj.user + "/" + obj.repo + "/tarball"
  obj.https_url = "https://github.com/" + obj.user + "/" + obj.repo
  obj.travis_url = "https://travis-ci.org/" + obj.user + "/" + obj.repo
  return obj
}
