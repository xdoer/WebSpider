/**
 * 爬虫配置
 * DELAY 为每次请求的间隔时间,值建议为0,当值为0抓不到数据时，再往大设置该值(单位毫秒)
 * CONCURRENT 每次请求的链接个数。(DELAY值为0，该值有效)
 * HEADER 请求头配置
 */
const UserAgent = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36(KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
  'Opera/9.80 (Windows NT 5.1; U; zh-cn) Presto/2.6.31 Version/10.70',
  'Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.70',
  'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; zh-cn) Opera 10.70',
  'Mozilla/5.0 (Windows NT 5.1; U; zh-cn; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
  'Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
  'Mozilla/5.0 (iPad; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
  'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
  'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
  'Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)'
]

module.exports = {
  DELAY: 0,
  CONCURRENT: 20,
  HEADER: {
    'User-Agent': UserAgent[Math.floor(Math.random() * UserAgent.length + 1) - 1]
  }
}
