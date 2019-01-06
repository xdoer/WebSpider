/**
 * 爬虫配置模型
 */

const monk = require('monk')
const { DB: { url } } = require('../config')
const db = monk(url)
const collection = db.get('crawl')

/**
 * 爬虫类
 */
class Crawl {
  /** 构建爬虫模型 */
  constructor ({ cid }) {
    this.cid = cid
    this.config = {}
    this.result = {}
    this.time = Date.now()
  }

  /** 保存爬虫配置 */
  save () {
    const crawl = {
      cid: this.cid,
      config: this.config,
      result: this.result
    }

    return collection.insert(crawl)
      .then(docs => ({
        state: true,
        data: docs,
        msg: '爬虫配置保存成功'
      }))
      .catch(err => ({
        state: false,
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
      data: docs,
      msg: docs.length > 0 ? '爬虫配置获取成功' : '爬虫配置获取失败'
    }))
    .catch(err => ({
      state: false,
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
      data: docs,
      msg: docs.n === 1 && docs.nModified === 1 && docs.ok === 1 ? '爬虫配置更新成功' : '爬虫配置更新失败'
    }))
    .catch((err) => ({
      state: false,
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
          data: docs.length > 0 ? '爬虫配置删除失败' : '爬虫配置删除成功',
          msg: docs.length > 0 ? '爬虫配置删除失败' : '爬虫配置删除成功'
        })).catch(err => err)
      }
    )
    .catch(err => ({
      state: false,
      data: err,
      msg: '爬虫配置删除失败'
    }))
}

module.exports = Crawl
