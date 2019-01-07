/**
 * 调试模块
 * DEBUG模式下，直接在控制台输出
 * LOG模式下，将程序运行状态写入文件
 */
const { DEBUG, LOG } = require('../config')
const _time = require('./time')
const fs = require('fs')
const path = require('path')

/**
 * 追加文本内容
 * @param {string} content - 输出的内容
 * @param {string} _path - 路径参数(error,running)
 */
const writeFile = (content, _path) => {
  const t = new Date()
  const filename = `${t.getFullYear()}${(t.getMonth() + 1).toString().padStart(2, 0)}${t.getDate().toString().padStart(2, 0)}.txt`
  fs.appendFile(path.resolve(__dirname, `../../log/${_path}/${filename}`), `${_time()} ${content} \n`, err => {
    if (err) console.log(err)
  })
}

/**
 * content为要输出的内容
 * err参数为错误输出标志位
 */
module.exports = (content, err = false) => {
  if (DEBUG) {
    console.log(`${_time()} ${content}`)
  }
  if (LOG) {
    if (err) {
      writeFile(content, 'error')
    } else {
      writeFile(content, 'running')
    }
  }
}
