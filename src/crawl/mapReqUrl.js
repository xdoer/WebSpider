/**
 * 批量请求链接
 */
const async = require('async')
const { CRAWL: { DELAY, CONCURRENT } } = require('../config')
const { _debug } = require('../utils')
const fetchResult = require('./fetchResult')

module.exports = async ({ urls, tags, depth, form, charset, proxy, tagNum }) => {
  let i = 0
  return new Promise((resolve, reject) => {
    async.mapLimit(urls, CONCURRENT, (url, fn) => {
      /**
       * 串行请求与并行请求
       * 当DELAY值不为0，说明是串行请求，每隔请求间隔为DELAY
       * 当DELAY为0，则进行并发请求，并发数CONCURRENT
       */
      if (DELAY) {
        /**
         * 闭包处理延迟执行时间
         * 每次维护一个数量为CONCURRENT的队列，队列执行完毕后，再维护一个队列，直到urls请求执行完毕
         * 这里还需要考虑有没有必要
         */
        (t => {
          setTimeout(() => {
            fetchResult({ url, tags, depth, form, charset, proxy, tagNum, fn })
          }, t)
        })(++i * DELAY)
      } else {
        fetchResult({ url, tags, depth, form, charset, proxy, tagNum, fn })
      }
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
