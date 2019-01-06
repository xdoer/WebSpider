/**
 * 参数验证模块
 * 用户通过POST方式提交的参数需要进行验证
 */
const { _filter: { filterEval, filterUrl }, _debug } = require('../../utils')

module.exports = ({ tags, form, proxies }) => {
  /**
   * 代理检测
   * 如果存在代理，则提交的代理必须是数组形式，并且每个代理都符合正确的形式
   */
  if (proxies && !(Array.isArray(proxies) || proxies.every(n => filterUrl(n)))) {
    _debug(`代理输入错误`, true)
    return false
  }

  /**
   * '输出格式'检测
   * 首先看是否是JSON格式，再分别检测各个字段中是否存在敏感内容
   */
  try {
    form = JSON.parse(form)
  } catch (e) {
    _debug(`form输入错误,错误详情:${e}`, true)
    return false
  }
  if (Object.values(form).some(n => filterEval(n))) {
    return false
  }

  /**
   * 过滤标签选择器
   */
  if (tags.some(n => filterEval(n))) {
    _debug(`标签选择器检测失败`, true)
    return false
  }
  return true
}
