/**
 * 代理模块
 * 将从接口获取到的代理写入文件，读取代理直接从文件中读取
 */

const { PROXY: { proxy, interval, timeout } } = require('../config')
const { proxyXiCi, proxyFreeList } = require('../data/config')
const crawl = require('../crawl')
const { _debug, _filter: { filterUrl } } = require('../utils')
const superagent = require('superagent')
require('superagent-proxy')(superagent)
const async = require('async')
const fs = require('fs')
const path = require('path')

/**
 * 代理写入函数
 * 将配置中的代理和请求到的代理整合写到文件中
 */
const writeProxies = async () => {
  // 初始化写入数据
  const content = { proxies: [] }

  // 如果存在西刺代理的配置，则抓取西刺代理.
  if (proxyXiCi) {
    const xici = await crawl(proxyXiCi)
    if (xici.state) {
      content.proxies = content.proxies.concat(xici.data)
    } else {
      _debug(`西刺代理获取失败,失败详情:${xici.data}`)
    }
  }
  if (proxyFreeList) {
    const list = await crawl(proxyFreeList)
    if (list.state) {
      content.proxies = content.proxies.concat(list.data)
    } else {
      _debug(`西刺代理获取失败,失败详情:${list.data}`)
    }
  }

  // 检测可用代理
  content.proxies = await new Promise(function (resolve, reject) {
    async.mapLimit(content.proxies, 100, (proxy, fn) => {
      const _proxy = `http://${proxy.ip}:${proxy.port}`
      superagent.get('http://ip-api.com/json').timeout(timeout).proxy(_proxy).buffer(true).end((err, res) => {
        if (err) {
          fn(null, '')
        } else {
          if (res.body['status'] === 'success') {
            fn(null, _proxy)
          } else {
            fn(null, '')
          }
        }
      })
    }, (err, res) => {
      // 加入时间戳用于之后的更新数据
      content.time = Date.now()
      resolve([...new Set(res)].filter(n => n !== '' && filterUrl(n)))
    })
  })

  // 整合直接写在配置文件中的代理
  content.proxies = proxy ? content.proxies.concat(proxy) : content.proxies

  // 将代理数据写入文件
  fs.writeFile(path.resolve(__dirname, '../data/proxies.json'), JSON.stringify(content), err => {
    if (err) {
      _debug(`代理文件写入错误,错误详情:${err}`, true)
    }
  })
}

/**
 * 读取代理函数
 */
const readProxies = async () => {
  let result = null
  try {
    result = fs.readFileSync(path.resolve(__dirname, '../data/proxies.json'))
  } catch (e) {
    _debug(`代理文件读取错误，请找到${__filename}文件运行写入代码`, true)
    return
  }

  let _time, _proxies
  try {
    const { time, proxies } = JSON.parse(result)
    _time = time
    _proxies = proxies
  } catch (e) {
    _debug(`代理文件解析失败，请找到${__filename}文件运行写入代码`, true)
    return
  }

  /**
   * 分析文件
   * 有time值，说明代理是通过URL请求获得的，则查看time值，判断是否需要更新代理
   */
  if (_time) {
    const t = Number.parseInt((Date.now() - _time) / (1000 * 60 * 60))
    if (t > interval) {
      await writeProxies()
    }
  }
  return Promise.resolve(_proxies)
}

module.exports = readProxies

// 没有文件写权限时取消下面的注释
// module.exports = () => []


// 运行时报本文件中的错误时，请删除data/proxies.json文件，取消下列代码注释，运行node proxy.js即可
// async function aa () {
//   await writeProxies()
// }
// aa()
