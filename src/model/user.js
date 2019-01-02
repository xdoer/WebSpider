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
   */
  constructor ({ name, password }) {
    this.uid = Date.now()
    this.name = name
    this.password = password
  }

  /**
   * 存储用户模型
   */
  save () {
    const user = {
      uid: this.uid,
      name: this.name,
      password: this.password
    }
    return collection.insert(user)
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
          msg: '文章保存失败'
        }
      })
  }
}

module.exports = User
