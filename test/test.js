/**
 * 爬虫测试文件
 */
const crawl = require('../src/crawl/index')

async function hh () {
  const g = await crawl({
    urls: ['https://www.thepaper.cn/'],
    tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
    form: {
      'title': "$element.children('.news_title').text()",
      'content': "$element.children('.news_txt').text()"
    },
    depth: 2
  })
  console.log(g)
}

hh()
