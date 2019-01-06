/**
 * 代理服务器接口
 * url为获取代理服务器的接口
 * interval为获取代理服务器的代理的间隔时间(单位:小时)
 * proxy是手动配置的内置代理(填写实例:['http://123.234.345.456','http://123.234.345.456'])
 * 手动配置的代理一般是可靠稳定的，适合抓内网中的数据
 */
module.exports = {
  url: 'https://proxys.herokuapp.com/fetchanswer?testTime=1000',
  interval: 5,
  proxy: []
}
