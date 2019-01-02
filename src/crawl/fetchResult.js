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

module.exports = ({ url, tags, tagNum, depth, form, charset, proxies, fn }) => {
  const bound = (err, res) => {
    if (err) {
      _debug(`请求出错 ${err}`, true)
    } else {
      // 保存抓取结果
      let result = []

      // 加载要解析的网页
      let $ = cheerio.load(res.text)

      // 标签选择器
      let target = null

      // "输出结果"格式中属性选择器解析状态
      let state = true
      let errMsg = ''

      try {
        // 将用户输入的标签选择器整合到上下文
        // 在koa路由那里已经验证过用户输入

        try {
          target = eval(tags[tagNum])     // eslint-disable-line
        } catch (e) {
          _debug(`用户输入解析失败,失败详情 ${e}`, true)
        }
        target.each(function (idx, element) {
          var $element = $(element)

          // num是爬取深度,tag_num是标签选择器数组下标
          // 当爬取深度等于标签选择器数组下标值，说明此时已经到达目标页面
          // 否则此时还在中间页面，需要继续解析链接标签选择器获得下一级的URL
          if (depth === tagNum + 1) {
            let tempResult = {}

            // 将"输出结果"中的键和值分别保存到数组
            let tempKey = Object.keys(form)
            let tempValue = Object.values(form)

            // 解析数据
            tempKey.forEach(function (key, idx) {
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
              // 通过链接标签选择器获取中间页面的URL
              let tempResult = new URL($element.attr('href'), url)
              result.push(tempResult)
            } catch (e) {
              state = false
              errMsg = `中间级的标签选择器应为a标签选择器，以使得程序顺利解析到下一级页面。`
              _debug(`中间页面的a标签选择器解析失败 ， 错误详情:${e}`, true)
            }
          }
        })
        state ? fn(null, result) : fn(errMsg)
      } catch (e) {
        _debug(`标签选择器解析出错，错误详情:${e}`, true)
        fn(e)
      }
    }
  }

  if (proxies.length > 0) {
    superagent.get(url).set(HEADER).proxy(proxies).charset(charset).end((err, res) => {
      bound(err, res)
    })
  } else {
    superagent.get(url).set(HEADER).charset(charset).end((err, res) => {
      bound(err, res)
    })
  }
}
