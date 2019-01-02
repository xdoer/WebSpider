/**
 * 批量请求链接
 */
const async = require('async')
const { CRAWL: { DELAY, CONCURRENT } } = require('../config')
const { _debug } = require('../utils')
const fetchResult = require('./fetchResult')

module.exports = ({ urls, tag, depth, form, charset, proxies, tagNum }) => {
  let i = 0
  return new Promise((resolve, reject) => {
    async.mapLimit(urls, CONCURRENT, (url, fn) => {
      
      (t => {
        setTimeout(() => {
          fetchResult({ url, tag, depth, form, charset, proxies, tagNum, fn })
        }, t)
      })(++i * DELAY)

    }, (err, res) => {
      if (err) {
        _debug(`map请求出错，错误详情 ${err}`)
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
