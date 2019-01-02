/**
 * 辅助函数
 * 拼接多维数组为一维
 */

const flatten = arr => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next), [])

module.exports = flatten
