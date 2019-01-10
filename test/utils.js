/**
 * 测试函数
 */
const { _splice, _statistics, _filter: { filterEval, filterUrl }, _time } = require('../src/utils')
const assert = require('assert')

// 测试多为数组转化为一维数组
describe('Utils文件夹中模块测试', function () {
  //数组转换
  describe('Splice', function () {
    describe('多维数组转化为一维数组', function () {
      it('应该返回一维数组', function () {
        assert.equal([1, 2, 3, 4].toString(), _splice([1, [2], [3, [4]]]).toString())
      })
    })
  })

  // 统计信息
  describe('Statistics', function () {
    describe('更新统计信息', function () {
      it('应该返回数据更新成功信息', async function () {
        const res = await _statistics({
          path: 'http://mocha-test.com',
          cid: '123456'
        }) 
        assert.equal(true, res.state)
      })    
    })
    describe('新建统计信息', function () {
      it('应该返回数据保存成功信息', async function () {
        const res = await _statistics({
          path: `http://mocha-test.com/${Date.now()}`,
          cid: '123456'
        })
        assert.equal(true, res.state)
      })
    })
  })

  // 过滤模块
  describe('Filter', function () {
    describe('爬虫模块整合用户输入需要进行关键字过滤', function () {
      it('应该返回布尔值', function () {
        assert.equal(false, filterEval('const'))
      })
    })
    describe('对用户输入的代理地址有效性检测', function () {
      it('应该返回布尔值', function () {
        assert.equal(false, filterUrl('http://123.234.345:123'))
      })
    })
  })

  // 格式化时间
  describe('Time', function () {
    describe('格式化时间', function () {
      it('应该返回格式化后的时间长度为19', function () {
        assert.equal(19, _time().length)
      })
    })
  })
})
