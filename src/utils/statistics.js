const formatTime = require('./time')
const _uuid = require('./uuid')
const _debug = require('./debug')
const { Statistics } = require('../model')

module.exports = async ({ path, cid, time = Date.now() }) => {
  const statistics = await Statistics.get({ url: path })
  if (statistics.state) {
    let { count, history } = statistics.data[0]
    const t = new Date()
    const year = t.getFullYear()
    const month = t.getMonth() + 1
    const day = t.getDate()

    // history 是一个三层嵌套的数组对象

    // "当年"标志位,历史记录中找到"当前"则为true
    let flag = false
    history.map(_year => {
      // 在历史记录中找到了当年
      if (_year.year === year) {
        flag = true

        let _flag = false
        _year.data.map(_month => {
          // 在历史记录中找到了当前月
          if (_month.month === month) {
            _flag = true

            let __flag = false
            _month.data.map(_day => {
              // 在当前月中找到了当天
              if (_day.day === day) {
                __flag = true
                _day.data.push(formatTime(t))
              }
            })
            // 如果当前月中没有找到当天,则将当天存入当月
            __flag || _month.data.push({ day, data: [formatTime(t)] })
          }
          _flag || _year.data.push({ month, data: [{ day, data: [formatTime(t)] }] })
        })
      }
      return _year
    })
    flag || history.push({ year, data: [{ month, data: [{ day, data: [formatTime(t)] }] }] })
    const res = await Statistics.update({ url: path }, { count: ++count, history })
    if (!res.state) {
      _debug('统计信息更新出错', true)
    }
    return res
  } else {
    const res = await (new Statistics({
      sid: _uuid(),
      cid: cid,
      url: path,
      time: time.toString(),
      count: 1
    })).save()
    if (!res.state) {
      _debug(`API初始化失败, 失败详情: ${res.msg}`, true)
    }
    return res
  }
}
