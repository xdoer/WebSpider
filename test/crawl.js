/**
 * 爬虫测试文件
 */
const assert = require('assert')
const crawl = require('../src/crawl')

describe('Crawl', function () {
  it('应该返回状态为true', async function () {
    const res = await crawl({
      urls: ['https://www.thepaper.cn/'],
      tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
      form: {
        'title': "$element.children('.news_title').text()",
        'content': "$element.children('.news_txt').text()"
      },
      depth: 2
    })
    assert.equal(true, res.state)
  })
})
