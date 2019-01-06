/**
 * 代理模块
 * 将从接口获取到的代理写入文件，读取代理直接从文件中读取
 */

const { PROXY: { url, proxy, interval } } = require('../config')
const superagent = require('superagent')
const { _debug } = require('../utils')
const fs = require('fs')
const path = require('path')

/**
 * 代理写入函数
 * 将配置中的代理和请求到的代理整合写到文件中
 */
const writeProxies = async () => {
  // 初始化写入数据
  const content = { proxies: [] }

  // 整合直接写在配置文件中的代理
  content.proxies = proxy ? content.proxies.concat(proxy) : content.proxies

  // 存在代理接口，则进行请求
  if (url) {
    superagent.get(url).end((err, res) => {
      if (err) {
        _debug(`代理接口数据获取失败,失败详情 ${err}`, true)
      } else {
        if (res.body.state) {
          content.proxies = content.proxies.concat(res.body.data)

          // 加入请求代理时间，用于更新数据
          content.time = Date.now()
          // 将代理数据写入文件
          fs.writeFile(path.resolve(__dirname, '../data/proxies.json'), JSON.stringify(content), err => {
            if (err) {
              _debug(`代理文件写入错误,错误详情:${err}`, true)
            }
          })
        } else {
          _debug(`代理接口数据获取失败,错误详情 ${res.body.data}`, true)
        }
      }
    })
  } else {
    // 将代理数据写入文件
    fs.writeFile(path.resolve(__dirname, '../data/proxies.json'), JSON.stringify(content), err => {
      if (err) {
        _debug(`代理文件写入错误,错误详情:${err}`, true)
      }
    })
  }
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

  try {
    result = JSON.parse(result)
  } catch (e) {
    _debug(`代理文件解析失败，请找到${__filename}文件运行写入代码`, true)
    return
  }

  /**
   * 分析文件
   * 有time值，说明代理是通过URL请求获得的，则查看time值，判断是否需要更新代理
   */
  if (result.time) {
    const t = Number.parseInt((Date.now() - result.time) / (1000 * 60 * 60))
    if (t > interval) {
      await writeProxies()
    }
  }
  return Promise.resolve(result.proxies)
}

module.exports = readProxies

// 运行时报本文件中的错误时，请删除data/proxies.json文件，取消下列代码注释，运行node proxy.js即可
// async function aa () {
//   await writeProxies()
// }
// aa()
