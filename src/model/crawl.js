/**
 * 爬虫配置模型
 */

const monk = require('monk')
const { DB: { url } } = require('../config')
const db = monk(url)
const collection = db.get('crawl')

/**
 * 爬虫类
 * @param {string} cid 当前爬虫配置id
 * @param {string} uid 用户id
 * @param {object} config 爬虫配置
 * @param {boolean} permission 配置权限,权限为true，则可以展示到分享页面
 * @param {number} interval 爬虫结果更新间隔时间
 * @param {object} result 爬虫抓取结果,对象内部 time 表示 value 更新时间
 * @param {string} time 配置创建时间
 */
class Crawl {
  /** 构建爬虫模型 */
  constructor ({ cid, uid, config, interval }) {
    this.cid = cid
    this.uid = uid
    this.config = config
    this.permission = false
    this.interval = interval
    this.result = {
      time: '' + Date.now(),
      value: []
    }
    this.tag = ''
    this.description = ''
    this.time = '' + Date.now()
  }

  /** 保存爬虫配置 */
  save () {
    const crawl = {
      cid: this.cid,
      uid: this.uid,
      config: this.config,
      permission: this.permission,
      interval: this.interval,
      result: this.result,
      tag: this.tag,
      description: this.description,
      time: this.time
    }

    return collection.insert(crawl)
      .then(docs => ({
        state: true,
        time: new Date(),
        data: docs,
        msg: '爬虫配置保存成功'
      }))
      .catch(err => ({
        state: false,
        time: new Date(),
        data: err,
        msg: '爬虫配置保存失败'
      }))
  }
}
/**
 * 获取用户信息
 * @param {object} findFlag - 根据传入的对象进行查找
 * @param {object} option - 可选的传入参数
 */
Crawl.get = (findFlag, option) => {
  return collection.find(findFlag, option)
    .then(docs => ({
      state: docs.length > 0,
      time: new Date(),
      data: docs,
      msg: docs.length > 0 ? '爬虫配置获取成功' : '爬虫配置获取失败'
    }))
    .catch(err => ({
      state: false,
      time: new Date(),
      data: err,
      msg: '爬虫配置获取失败'
    }))
}

/**
 * 更新用户信息
 * @param {object} findFlag - 根据传入的对象进行查找
 * @param {object} newValue - 更新查找到相应字段
 */
Crawl.update = (findFlag, newValue) => {
  return collection.update(findFlag, { $set: newValue })
    .then(docs => ({
      state: docs.n === 1 && docs.nModified === 1 && docs.ok === 1,
      time: new Date(),
      data: docs,
      msg: docs.n === 1 && docs.nModified === 1 && docs.ok === 1 ? '爬虫配置更新成功' : '爬虫配置更新失败'
    }))
    .catch((err) => ({
      state: false,
      time: new Date(),
      data: err,
      msg: '爬虫配置更新失败'
    }))
}

/**
 * 删除用户信息
 * @param {object} findFlag - 根据传入的对象进行查找
 */
Crawl.delete = findFlag => {
  return collection.remove(findFlag)
    .then(
      () => {
        return collection.find(findFlag).then(docs => ({
          state: docs.length === 0,
          time: new Date(),
          data: docs.length > 0 ? '爬虫配置删除失败' : '爬虫配置删除成功',
          msg: docs.length > 0 ? '爬虫配置删除失败' : '爬虫配置删除成功'
        })).catch(err => err)
      }
    )
    .catch(err => ({
      state: false,
      time: new Date(),
      data: err,
      msg: '爬虫配置删除失败'
    }))
}

module.exports = Crawl
