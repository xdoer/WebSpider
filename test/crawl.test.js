/**
 * 爬虫测试文件
 */
const { expect } = require('chai')
const crawl = require('../src/crawl')

describe('爬虫测试', function () {
  it('返回值 state 字段应该为 true', async function () {
    const res = await crawl({
      urls: ['https://www.thepaper.cn/'],
      tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
      form: {
        'title': "$element.children('.news_title').text()",
        'content': "$element.children('.news_txt').text()"
      },
      depth: 2
    })
    expect(res.state).to.be.ok
  })
})
