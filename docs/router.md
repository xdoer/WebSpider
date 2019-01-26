# 接口文档

## 根路由
程序中内置了一个静态服务器，将HTML文件放到`/static`目录下。即可通过**根路由**访问到HTML文件。当然你也可以使用 Nginx, Tomcat等部署，但此时前后端在不同的域 需要注意跨域问题，另外还需注意，前端点击生成API，得到的 API 是后端域的链接。比如，前端在`spider.example.com`这个域，而后端在`server.example.com`这个域，生成个的 API 将是 `server.example.cn/1234456`形式。

## 用户路由
用户路由中提供了用户注册，用户登录，账号注销，账户删除四个接口

### 用户注册
接口地址: `/user/register`
请求方式: POST
传递参数: name, password, repeatPassword
参数类型: 字符串
其他: name字段要求长度大于3，password字段长度大于6

### 用户登录
接口地址: `/user/login`
请求方式: POST
传递参数: name, password
参数类型: 字符串
其他: name字段要求长度大于3，password字段长度大于6

### 账号注销
接口地址: `/user/logout`
请求方式: GET

### 账号删除
接口地址: `/user/delete`
请求方式: POST
传递参数: name, password
参数类型: 字符串

## 爬虫路由
爬虫路由中提供了结果预览、配置保存(即生成API操作)、配置共享、API接口、配置获取、配置更新、配置删除

### 结果预览
接口地址: `/crawl/preview`
请求方式: POST
传递参数: url(字符串)、tags(数组)、depth(字符串)、form(JSON)、charset(字符串)、proxyMode(字符串)、proxies(数组)、mode(字符串)、start(字符串)、end(字符串)

### 配置保存(登录)
接口地址: `/crawl/save`
请求方式: POST
传递参数: url(字符串)、tags(数组)、depth(字符串)、form(JSON)、charset(字符串)、proxyMode(字符串)、proxies(数组)、mode(字符串)、start(字符串)、end(字符串)

### 配置共享
接口地址: `/crawl/share`
请求方式: GET
传递参数: page,pageSize
参数类型: 字符串

### API调用
接口地址: `/crawl/api`
请求方式: GET
传递参数: user、cid
参数类型: 字符串

### 配置删除(登录)
接口地址: `/crawl/delete`
请求方式: DELETE
传递参数: cid
参数类型: 字符串

### 配置获取(登录)
接口地址: `/crawl/config`
请求方式: GET
传递参数: page、pageSize
参数类型: 字符串

### 配置更新(登录)
接口地址: `/crawl/config`
请求方式: POST
传递参数: cid, permission, tag, description
参数类型: 字符串

## 代理路由
接口地址: `/proxy`
请求方式: GET

**注意: 接口调用示例在/test/router.test.js中**


## 接口返回
接口返回格式
```javascript
{
  state: true,
  data: ...,
  msg: ...
}
```
***state*** 表示此次成功还是失败；***data*** 表示操作获取到的数据；***msg*** 额外提示消息。部分路由还带有 ***time*** 字段，表示数据更新时间