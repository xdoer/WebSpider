/**
 * 过滤用户输入
 * 用户输入中不能带有js中关键字信息
 */

const regList = [
  /import/i,
  /require/i,
  /export/i,
  /var\s/i,
  /promise/i,
  /const\s/i,
  /let\s/i,
  /console/i,
  /eval/i,
  /new\s/i,
  /Function/i
]

/**
 * @returns Function 模块返回一个函数
 * 函数返回 true 或 false
 * 当传入的参数被正则列表中匹配到，则返回true，说明用户可能有恶意
 */
module.exports = m => regList.some(n => n.test(m))
