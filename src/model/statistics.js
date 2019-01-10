/**
 * 应用
 */

const monk = require('monk')
const { DB: { url } } = require('../config')
const _time= require('../utils/time')
const db = monk(url)
const collection = db.get('statistics')

/**
 * API调用统计模型
 * @param {string} url 调用的API
 * @param {string} time API创建时间
 * @param {number} count API调用总次数
 */
class Statistics {
  constructor ({ sid, cid, url, time, count }) {
    this.sid = sid
    this.cid = cid
    this.url = url
    this.time = time.toString()
    this.count = count
  }
  save () {
    /**
     * 按年、月、日统计
     */
    const t = new Date()
    const year = t.getFullYear()
    const month = t.getMonth() + 1
    const day = t.getDate()

    const statistics = {
      sid: this.sid,
      cid: this.cid,
      url: this.url,
      time: this.time,
      count: this.count,
      history: [{
        year,
        data:[{
          month,
          data:[{
            day,
            // data的长度就是当天的该 API 调用次数
            data:[_time(t)]
          }]
        }]
      }]
    }
    return collection.insert(statistics)
      .then(docs => ({
        state: true,
        data: docs,
        msg: 'API调用统计初始化成功'
      }))
      .catch(err => ({
        state: false,
        data: err,
        msg: 'API调用统计初始化失败'
      }))
  }
}

Statistics.get = (findFlag, option) => {
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

Statistics.update = (findFlag, newValue) => {
  return collection.update(findFlag, { $set: newValue })
    .then(docs => ({
      state: docs.n === 1 && docs.nModified === 1 && docs.ok === 1,
      data: docs,
      msg: docs.n === 1 && docs.nModified === 1 && docs.ok === 1 ? 'API调用统计信息更新成功' : 'API调用统计信息更新失败'
    }))
    .catch((err) => ({
      state: false,
      data: err,
      msg: 'API调用统计信息更新失败'
    }))
}

Statistics.delete = findFlag => {
  return collection.remove(findFlag)
    .then(
      () => {
        return collection.find(findFlag).then(docs => ({
          state: docs.length === 0,
          data: docs.length > 0 ? 'API调用统计信息删除失败' : 'API调用统计信息删除成功',
          msg: docs.length > 0 ? 'API调用统计信息删除失败' : 'API调用统计信息删除成功'
        })).catch(err => err)
      }
    )
    .catch(err => ({
      state: false,
      data: err,
      msg: 'API调用统计信息删除失败'
    }))
}

module.exports = Statistics
