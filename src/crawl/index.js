/**
 * 爬虫主控函数模块
 * 控制爬虫运行流程
 */
const mapReqUrl = require('./mapReqUrl')
const { _debug, _splice } = require('../utils')

/**
 * 控制器
 */
const bound = ({ res, tags, depth, form, charset, proxies, tagNum }) => depth > tagNum ? mapReqUrl({ res: _splice(res), tags, depth, form, charset, proxies, tagNum }) : res

/**
 * 主控函数
 * @param {Array} urls 爬取的链接列表
 * @param {Array} tags 分析的标签列表
 * @param {Number} depth 抓取深度
 * @param {Object} form 需要输出的形式
 * @param {String} charset 网页编码
 * @param {Array} proxies 代理(默认无代理)
 */
module.exports = async ({ urls, tags, depth, form, charset, proxies = [] }) => {
  let i = 0
  /**
   * tagNum参数-tags数组下标
   * 内部函数中需要判断当前深度与分析到的标签的个数来决定用不用继续向下分析
   * */
  return mapReqUrl({ urls, tags, depth, form, charset, proxies, tagNum: i++ })
    .then(res => {
      _debug(`主控函数-流程1-执行结果 ${res}`)
      return bound({ res, tags, depth, form, charset, proxies, tagNum: i++ })
    })
    .then(res => {
      _debug(`主控函数-流程2-执行结果 ${res}`)
      return bound({ res, tags, depth, form, charset, proxies, tagNum: i++ })
    })
    .catch(err => {
      _debug(`主控函数-流程执行出错 ${err}`, true)
    })
}
