/**
 * 过滤用户输入
 */

const regList = [
  /import/i,
  /require/i,
  /export/i,
  /var\s/i,
  /promise/i,
  /const\s/i,
  /let\s/i,
  /console/i,
  /eval/i,
  /new\s/i,
  /Function/i,
  /superagent/i,
  /cheerio/i
]

module.exports = {
  filterEval: m => regList.some(n => n.test(m)),
  filterUrl: m => /^http:\/\/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?):\d{2,5}/g.test(m)
}
