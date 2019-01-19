/**
 * 爬虫主函数
 */

// 启用严格模式，防止用户输入的恶意内容被程序执行
'use strict'

const superagent = require('superagent')
const cheerio = require('cheerio')
const { URL } = require('url')
const { _debug } = require('../utils')
const { CRAWL: { HEADER } } = require('../config')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)

module.exports = async ({ url, tags, tagNum, depth = 1, form, charset = 'utf-8', proxy, fn }) => {
  const bound = (err, res) => {
    if (err) {
      _debug(`请求出错 ${err}`, true)
      fn(err)
    } else {
      let result = [] // 返回的抓取结果
      let $ = cheerio.load(res.text) // 加载文件
      let tag = null // 解析后的标签选择器
      let state = true // fn回调函数返回控制
      let errMsg = '' // 错误信息

      // 验证用户输入，放在路由那里
      try {
        tag = eval(tags[tagNum])     // eslint-disable-line
      } catch (e) {
        _debug(`标签选择器解析失败,失败详情 ${e}`, true)
        return
      }

      tag.each((idx, element) => {
        let $element = $(element)

        // 根据抓取深度与标签下标的关系判断当前是要获取进入下一页的a标签，还是要获取数据
        if (depth === tagNum + 1) {
          let tempResult = {}
          /**
           * 单纯描述数据其实可以用map数据结构
           * const _form = new Map(Object.entries(form))
           * let tempKey = _form.keys()
           * let tempValue = _form.values()
           * 参考:http://es6.ruanyifeng.com/#docs/style#Map-%E7%BB%93%E6%9E%84
           * 不过看起来绕弯弯，不如Object.keys()直接
           */

          let tempKey = Object.keys(form)
          let tempValue = Object.values(form)

          tempKey.forEach((key, idx) => {
            try {
              tempResult[key] = eval(tempValue[idx]) // eslint-disable-line
            } catch (e) {
              state = false
              errMsg = e.toString()
              _debug(`属性选择器解析失败，失败详情 ${e}`, true)
            }
          })
          result.push(tempResult)
        } else {
          try {
            let href = $element.attr('href')
            let tempResult = (new URL(href, url)).href
            result.push(tempResult)
          } catch (e) {
            state = false
            errMsg = `中间级的标签选择器应为a标签选择器，以使得程序顺利解析到下一级页面。`
            _debug(`中间页面的a标签选择器解析失败,错误详情:${e}`, true)
          }
        }
      })
      state ? fn(null, result) : fn(errMsg)
    }
  }

  if (proxy) {
    superagent.get(url).set(HEADER).proxy(proxy).charset(charset).buffer(true).end((err, res) => {
      bound(err, res)
    })
  } else {
    superagent.get(url).set(HEADER).charset(charset).buffer(true).end((err, res) => {
      bound(err, res)
    })
  }
}
