/**
 * 格式化时间
 * @function
 * 有原生的toLocaleString方法可以格式化输出，但不同平台，浏览器有不同的输出结果，故需要此函数对时间格式化
 */

/**
 * 格式化位数
 * @param {Number} n 数字对象
 */
const formatNumber = n => n.toString().padStart(2, 0)

/**
 * 主函数
 * @param {Date} date 传入Date对象
 */
const formatTime = (date = new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${formatNumber(year)}年${formatNumber(month)}月${formatNumber(day)}日${[hour, minute, second].map(formatNumber).join(':')}`
}

module.exports = formatTime
