/**
 * 过滤用户输入
 */

const regList = [
  /import\s/i,
  /require/i,
  /export\s/i,
  /var\s/i,
  /const\s/i,
  /let\s/i,
  /promise/i,
  /console/i,
  /eval/i,
  /new\s/i,
  /function/i,
  /superagent/i,
  /cheerio/i,
  /_debug/i,
  /[;|!|]/i
]

const xssList = [
  /document/i,
  /script/i,
  /[;|!|]/i
]

module.exports = {
  isInvalidEval: m => regList.some(n => n.test(m)),
  isInvalidParam: m => xssList.some(n => n.test(m)),
  isInvalidUrl: m => !(/^http:\/\/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?):\d{2,5}/g.test(m))
}
