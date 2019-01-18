/**
 * 辅助函数
 * 拼接多维数组为一维
 */

module.exports = arr => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next), [])
