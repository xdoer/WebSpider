/**
 * 代理服务器接口
 * url为获取代理服务器的接口.(如果应用部署环境没有写文件权限，该配置项请置空)
 * interval为获取代理服务器的代理的间隔时间(单位:小时)
 * proxy是手动配置的内置代理(填写实例:['http://123.234.345.456','http://123.234.345.456'])
 * 手动配置的代理一般是可靠稳定的，适合抓内网中的数据
 */
module.exports = {
  url: 'https://proxys.herokuapp.com/fetchanswer?testTime=1000',
  interval: 10,
  proxy: []
}
