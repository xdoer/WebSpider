/**
 * 参数验证模块
 * 提交的参数需要进行验证
 */
const { _filter: { isInvalidEval, isInvalidUrl }, _debug, _isNaN } = require('../../utils')

module.exports = ({ url, tags, depth, form, charset, proxyMode, proxies, mode, start, end }) => {
  const isType = Object.prototype.toString
  // 判断是否为字符串
  const strAry = [url, depth, charset, proxyMode, mode, start, end]
  if (strAry.some(n => isType.call(n) !== '[object String]')) {
    _debug(`url/depth/start/end 不是 String 类型`, true)
    return {
      state: false,
      msg: 'url/depth/start/end 不是 String 类型'
    }
  }

  // 判断是否为数组
  if (!Array.isArray(tags) || !Array.isArray(proxies)) {
    _debug(`tags/proxies 不是 Array 类型`, true)
    return {
      state: false,
      msg: 'tags/proxies 不是 Array 类型'
    }
  }

  // 数据校验
  if ([depth, start, end].some(n => _isNaN(n))) {
    _debug(`depth/start/end/应当可以转化为 Number 类型且不为NaN`, true)
    return {
      state: false,
      msg: 'depth/start/end应当可以转化为 Number 类型且不为NaN'
    }
  }

  if (['utf-8', 'gbk', 'gb2312'].indexOf(charset) === -1) {
    _debug(`charset应当为 utf-8 或 gbk 或 gb2312`, true)
    return {
      state: false,
      msg: 'charset应当应当为 utf-8 或 gbk 或 gb2312'
    }
  }

  if (['none', 'internal', 'own'].indexOf(proxyMode) === -1) {
    _debug(`proxyMode 应当为 none 或 internal 或 own`, true)
    return {
      state: false,
      msg: 'proxyMode 应当为 none 或 internal 或 own'
    }
  }

  /**
   * 代理检测
   * 如果存在代理，则提交的代理必须是数组形式，并且每个代理都符合正确的形式
   */
  if (proxies.some(n => !isInvalidUrl(n))) {
    _debug(`代理输入错误`, true)
    return {
      state: false,
      msg: '代理输入错误'
    }
  }

  /**
   * '输出格式'检测
   * 前端检测JSON格式数据，经 QS 模块 post 传递到后端变成对象形式。再分别检测各个字段中是否存在敏感内容
   */

  let _form
  try {
    _form = process.env.NODE_ENV === 'test' ? form : JSON.parse(form)
  } catch (e) {
    _debug(`代理输入错误`, true)
    return {
      state: false,
      msg: '"输出格式"填写有误'
    }
  }

  if (Object.values(_form).some(n => isInvalidEval(n))) {
    _debug('form 数据中存在被过滤的关键字', true)
    return {
      state: false,
      msg: '"输出格式"中存在被过滤的关键字'
    }
  }

  /**
   * 过滤标签选择器
   */
  if (tags.some(n => isInvalidEval(n))) {
    _debug(`tags 标签选择器中存在被过滤的关键字`, true)
    return {
      state: false,
      msg: '标签选择器中存在被过滤的关键字'
    }
  }

  return {
    state: true,
    msg: '数据校验成功'
  }
}
