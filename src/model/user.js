/**
 * 用户模型
 */

const monk = require('monk')
const { DB: { url } } = require('../config')
const db = monk(url)
const collection = db.get('user')

class User {
  /**
   * @constructor 描述用户模型
   * @param {string} name - 用户姓名
   * @param {string} password - 用户密码
   * @param {string} uid - 传入的用户ID
   */
  constructor ({ name, password, uid }) {
    this.uid = uid
    this.name = name
    this.password = password
    this.time = '' + Date.now()
  }

  /**
   * 存储用户模型
   */
  save () {
    const user = {
      uid: this.uid,
      name: this.name,
      password: this.password,
      time: this.time
    }
    return collection.insert(user)
      .then(docs => ({
        state: true,
        time: new Date().toLocaleString(),
        data: docs,
        msg: '用户信息配置保存成功'
      }))
      .catch(err => ({
        state: false,
        time: new Date().toLocaleString(),
        data: err,
        msg: '用户信息配置保存失败'
      }))
  }

  /**
   * 获取用户信息
   * @param {object} findFlag - 根据传入的对象进行查找
   * @param {object} option - 可选的传入参数
   */
  static get (findFlag, option) {
    return collection.find(findFlag, option)
      .then(docs => ({
        state: docs.length > 0,
        time: new Date().toLocaleString(),
        data: docs,
        msg: docs.length > 0 ? '用户信息获取成功' : '用户信息获取失败'
      }))
      .catch(err => ({
        state: false,
        time: new Date().toLocaleString(),
        data: err,
        msg: '用户信息获取失败'
      }))
  }

  /**
   * 更新用户信息
   * @param {object} findFlag - 根据传入的对象进行查找
   * @param {object} newValue - 更新查找到相应字段
   */
  static update (findFlag, newValue) {
    return collection.update(findFlag, { $set: newValue })
      .then(docs => ({
        state: docs.n === 1 && docs.nModified === 1 && docs.ok === 1,
        time: new Date().toLocaleString(),
        data: docs,
        msg: docs.n === 1 && docs.nModified === 1 && docs.ok === 1 ? '用户信息更新成功' : '用户信息更新失败'
      }))
      .catch((err) => ({
        state: false,
        time: new Date().toLocaleString(),
        data: err,
        msg: '用户信息更新失败'
      }))
  }

  /**
   * 删除用户信息
   * @param {object} findFlag - 根据传入的对象进行查找
   */
  static delete (findFlag) {
    return collection.remove(findFlag)
      .then(
      //   docs => ({
      //   state: docs.n === 1 && docs.ok === 1,
      //   data: docs,
      //   msg: docs.n === 1 && docs.ok === 1 ? '用户信息删除成功' : '用户信息删除失败'
      // })

        /** 删除文档返回格式复杂，要使用其内置对象，不符合书写规范，所以使用再查询的方式判断是否删除成功 */
        () => {
          return collection.find(findFlag).then(docs => ({
            state: docs.length === 0,
            time: new Date().toLocaleString(),
            data: docs.length > 0 ? '用户信息删除失败' : '用户信息删除成功',
            msg: docs.length > 0 ? '用户信息删除失败' : '用户信息删除成功'
          })).catch(err => err)
        }
      )
      .catch(err => ({
        state: false,
        time: new Date().toLocaleString(),
        data: err,
        msg: '用户信息删除失败'
      }))
  }
}

module.exports = User
