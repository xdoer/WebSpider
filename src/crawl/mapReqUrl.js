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
      /**
       * 闭包处理延迟执行时间
       * 每次维护一个数量为CONCURRENT的队列，队列执行完毕后，再维护一个队列，直到urls请求执行完毕
       */
      (t => {
        setTimeout(() => {
          fetchResult({ url, tag, depth, form, charset, proxies, tagNum, fn })
        }, t)
      })(++i * DELAY)
    }, (err, res) => {
      if (err) {
        _debug(`map请求出错，错误详情 ${err}`, true)
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
