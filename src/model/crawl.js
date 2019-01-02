/**
 * 爬虫配置模型>
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
  constructor () {
    this.cid = Date.now()
    this.config = {}
    this.result = {}
  }

  /** 保存爬虫配置 */
  save () {
    const crawl = {
      cid: this.cid,
      config: this.config,
      result: this.result
    }

    /**
     * @returns {Promise}
     */
    return collection.insert(crawl)
      .then(docs => {
        return {
          state: true,
          data: docs,
          msg: '配置保存成功'
        }
      }).catch((err) => {
        return {
          state: false,
          data: err,
          msg: '配置保存失败'
        }
      })
  }
}

module.exports = Crawl
