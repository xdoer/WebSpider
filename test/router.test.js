const server = require('../src')
const { PORT } = require('../src/config')
const { expect } = require('chai')
const request = require('supertest')

describe('路由测试', function () {
  let cookie // 登录或注册时需要记录cookie，以使得能够测试保存配置
  let cid, name = 'test' // 构建API时需要用到
  let _cid  // 测试删除配置时用到
  let testName = `test${Date.now()}` // 测试删除账号用的

  let app = server.listen(PORT, () => {
    console.log('路由测试服务已开启')
  })

  describe('用户路由', function () {
    describe('用户注册', function () {
      describe('用户注册成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/user/register')
            .send({
              name,
              password: '123456',
              repeatPassword: '123456'
            })
            .expect(200)
            expect(res.body.state).to.be.ok
        })
      })
      describe('用户注册失败(用户名冲突)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/user/register')
            .send({
              name,
              password: '123456',
              repeatPassword: '123456'
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('用户注册失败(密码长度不够)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/user/register')
            .send({
              name: `test${Date.now()}`,
              password: '1234',
              repeatPassword: '1234'
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok         
        })
      })
      describe('用户注册失败(参数数量不够)', function () {
        it('返回值 state 字段应该为 false', async function () {
          let res = await request(app)
            .post('/user/register')
            .send({
              name: `test${Date.now()}`,
              password: '123456'
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok            
        })
      })
    })
    describe('账号删除', function () {
      describe('用户注册(用作测试删除账号)', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/user/register')
            .send({
              name: testName,
              password: '123456',
              repeatPassword: '123456'
            })
            .expect(200)
          cookie = res.header['set-cookie'].join(';')
          expect(res.body.state).to.be.ok
        })
      })
      describe('账号删除失败(用户未登录)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/user/delete')
            .send({
              name: testName,
              password: '123456'
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('账号删除失败(参数缺失)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/user/delete')
            .set('Cookie', cookie)
            .send({
              name: testName
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('账号删除失败(密码错误)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/user/delete')
            .set('Cookie', cookie)
            .send({
              name: testName,
              password: '1234567'
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('账号删除成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/user/delete')
            .set('Cookie', cookie)
            .send({
              name: testName,
              password: '123456'
            })
            .expect(200)
          expect(res.body.state).to.be.ok
        })
      })
    })
    describe('用户登录', function () {
      describe('用户登录成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app).post('/user/login')
          .send({
            name,
            password: '123456'
          })
          .expect(200)
          cookie = res.header['set-cookie'].join(';')
          expect(res.body.state).to.be.ok   
        })
      })
      describe('用户登录失败(用户不存在)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app).post('/user/login')
          .send({
            name: `test${Date.now()}`,
            password: '123456'
          })
          .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('用户登录失败(密码错误)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app).post('/user/login')
          .send({
            name,
            password: '1234567'
          })
          .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('用户登录失败(密码长度不够)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
          .post('/user/login')
          .send({
            name,
            password: '123'
          })
          .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
    })
  })

  describe('爬虫路由', function () {
    describe('预览结果', function () {
      describe('预览结果成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/crawl/preview')
            .send({
              url: 'https://www.thepaper.cn',
              tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
              depth: '2',
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              }
            })
            .expect(200)
          expect(res.body.state).to.be.ok
        })
      })
      describe('预览结果失败(参数不完整)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/crawl/preview')
            .send({
              url: 'https://www.thepaper.cn',
              depth: '2',
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              },
              proxyMode: 'internal'
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('预览结果失败(参数类型错误)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/crawl/preview')
            .send({
              url: 'https://www.thepaper.cn',
              tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
              depth: 2,
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              }
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('预览结果失败(包含被禁止的关键字)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/crawl/preview')
            .send({
              url: 'https://www.thepaper.cn',
              tags: ["$('.news_li').children('h2').children('a')", "$('.export')"],
              depth: 2,
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              }
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('预览结果失败(代理地址输入错误)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .post('/crawl/preview')
            .send({
              url: 'https://www.thepaper.cn',
              tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
              depth: '2',
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              },
              proxyMode: 'own',
              proxies: ['http://123.234.345.456:1', '123.234.345.456']
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
    })
    // "保存配置"检测逻辑与预览时一样的
    // 需要记录配置 id 用于 API 请求
    describe('配置相关', function () {
      describe('配置保存成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/crawl/save')
            .set('Cookie', cookie)
            .send({
              url: 'https://www.thepaper.cn',
              tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
              depth: '2',
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              }   
            })
            .expect(200)
          cid = res.body.data.cid
          expect(res.body.state).to.be.ok
        })
      })
      describe('配置更新成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/crawl/config')
            .set('Cookie', cookie)
            .send({
              cid,
              permission: 'true'
            })
            .expect(200)
          expect(res.body.state).to.be.ok
        })
      })
      describe('配置更新失败(配置ID错误)', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/crawl/config')
            .set('Cookie', cookie)
            .send({
              cid: 'testN',
              permission: true
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('配置更新失败(缺少参数)', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/crawl/config')
            .set('Cookie', cookie)
            .send({
              cid
            })
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('配置保存成功(测试删除配置用)', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .post('/crawl/save')
            .set('Cookie', cookie)
            .send({
              url: 'https://www.thepaper.cn',
              tags: ["$('.news_li').children('h2').children('a')", "$('.newscontent')"],
              depth: '2',
              form: {
                'title': "$element.children('.news_title').text()",
                'content': "$element.children('.news_txt').text()"
              }
            })
            .expect(200)
          _cid = res.body.data.cid
          expect(res.body.state).to.be.ok
        })
      })
      // 配置删除
      describe('配置删除成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .delete('/crawl/config')
            .set('Cookie', cookie)
            .send({
              cid: _cid
            })
            .expect(200)
          expect(res.body.state).to.be.ok
        })
      })
    })
    describe('API调用', function () {
      describe('API调用成功', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await request(app)
            .get(`/crawl/api?user=${name}&cid=${cid}`)
            .expect(200)
          expect(res.body.state).to.be.ok
        })
      })
      describe('API调用失败(API请求频率限制-请求频率限制在两秒)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .get(`/crawl/api?user=${name}&cid=${cid}`)
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })
      })
      describe('API调用成功(API请求频率限制-两秒后执行请求)', function () {
        it('返回值 state 字段应该为 true', async function () {
          const res = await new Promise((resolve, reject) => {
            // 1秒后执行请求
            setTimeout(()=>{
              request(app)
                .get(`/crawl/api?user=${name}&cid=${cid}`)
                .expect(200)
                .end((err, res)=>{
                  if (err) reject(err)
                  resolve(res)
                })
            }, 2000)
          })
          expect(res.body.state).to.be.ok
        })
      })
      describe('API调用失败(用户名错误)', function () { 
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .get(`/crawl/api?user=${name+Date.now()}&cid=${cid}`)
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })                
      })
      describe('API调用失败(配置ID错误)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .get(`/crawl/api?user=${name}&cid=2${cid}2`)
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })        
      })
      describe('API调用失败(参数不完整)', function () {
        it('返回值 state 字段应该为 false', async function () {
          const res = await request(app)
            .get(`/crawl/api?user=${name}`)
            .expect(200)
          expect(res.body.state).to.not.be.ok
        })        
      })
    })
  })
})
