/**
 * 过滤用户输入
 */

const regList = []

const xssList = [
  /document/i,
  /script/i,
  /[;!=]/i
]

module.exports = {
  isInvalidEval: m => regList.some(n => n.test(m)),
  isInvalidParam: m => xssList.some(n => n.test(m)),
  isInvalidUrl: m => !(/^http:\/\/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?):\d{2,5}/g.test(m))
}
