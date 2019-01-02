/**
 * 运行写入模块
 * 记录爬虫运行状态
 */
const fs = require('fs')
const path = require('path')
const _time = require('./time')

const writeFile = (content, _path) => {
  const t = new Date()
  const filename = `${t.getFullYear()}${(t.getMonth() + 1).toString().padStart(2, 0)}${t.getDate().toString().padStart(2, 0)}.txt`  
  fs.appendFile(path.resolve(__dirname, `../../log/${_path}/${filename}`), `${_time()} ${content} \n`, err => {
    if (err) console.log(err)
  })
}

module.exports = {
  error (content) {
    writeFile(content, 'error')
  },
  log (content) {
    writeFile(content, 'running')
  }
}