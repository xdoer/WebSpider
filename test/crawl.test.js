/**
 * 爬虫测试文件
 */
const { expect } = require('chai')
const crawl = require('../src/crawl')
const { newspaper } = require('../src/data/config')

describe('爬虫测试', function () {
  it('返回值 state 字段应该为 true', async function () {
    const res = await crawl(newspaper)
    expect(res.state).to.be.ok
  })
})
