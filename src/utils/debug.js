/**
 * 调试模块
 * DEBUG模式下，直接在控制台输出
 * LOG模式下，将程序运行状态写入文件
 */
const { DEBUG, LOG } = require('../config')
const _note = require('./note')
const _time = require('./time')

/** 
 * content为要输出的内容
 * err参数为错误输出标志位
 */
module.exports = (content, err) => {
  if (DEBUG) {
    console.log(`${_time()} content`)
  }
  if (LOG) {
    if (err) {
      _note.error(content)
    } else {
      _note.log(content)
    }
  }
}