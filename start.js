const app = require('./src/')
const { PORT } = require('./src/config')

// 开启服务端口
app.listen(PORT, () => {
  console.log('服务已打开')
})
