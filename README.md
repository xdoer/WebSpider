# WebSpider

基于NodeJS的在线爬虫系统。支持提供在线数据API。

1、当你想在自己的网站添加一个小的新闻模块时，你可以利用WebSpider爬虫爬取指定网站的数据，然后在后端或者前端请求数据接口，再将获得的数据构造到你的网页上。

2、当你想做个聚合网站或者聚合app时，你可以利用WebSpider爬取各大站点的数据，然后调用API，构造数据到自己的APP中。

...

由此,WebSpider诞生了。


## 内容目录

- [WebSpider](#WebSpider)
    - [特性](#特性)
    - [本地测试](#本地测试)
    - [项目目录](#项目目录)
    - [核心代码](#核心代码)
    - [使用](#使用)
        - [爬取深度](#1爬取深度)
        - [网页编码](#2网页编码)
        - [抓取模式](#3抓取模式)
        - [页码范围](#4页码范围)
        - [目标网址](#5目标网址)
        - [选择器](#6选择器)
        - [输出格式](#7输出格式)
        - [代理模式](#8代理模式)
        - [结果预览](#9结果预览)
        - [生成API](#10生成API)
        - [更新间隔](#12标签(后台管理配置项))
        - [开放权限](#13开放权限(后台管理配置项))
        - [描述信息](#14描述信息(后台管理配置项))
    - [数据接口调用示例](#数据接口调用示例)
    - [示例配置参考](#示例配置参考)
    - [更新日志](#更新日志)
    - [注意](#注意)
    - [TODO](#TODO)
    - [协议](#协议)

## 特性

> * 简单、方便。只要掌握简单的网页知识，即可利用WebSpider在线爬虫系统，进行简单的配置之后，可进行数据抓取预览。

> * 功能强大。支持抓取预览，定制输出，生成API，API管理，查看分享，登录注册等功能。

> * 响应速度快。抓取结果保存在数据库中，根据用户配置更新响应数据。


## 本地测试
1、安装Nodejs,MongoDB,Git,Redis

2、保证程序有写文件权限

3、运行代码
```
git clone https://github.com/LuckyHH/WebSpider.git
cd WebSpider
npm install
```

4、修改配置文件(src/config)-自定义启动端口，数据库名，Redis等

5、运行`npm start`启动项目

6，打开```http://localhost:3000```

## 项目目录
```
|---docs 模块说明文档
|    |---env.md 环境说明
|    |---issues.md 相关问题说明
|    |---proxy.md 代理说明
|    |---router.md 接口文档
|    |---history.md 更新日志
|    |---panel.md 前端面板说明
|---log 日志文件(按天新建日志文件)
|    |---error 错误日志
|    |---running 运行日志
|---src 源代码
|    |---config 配置
|          |---index.js 配置项出口控制
|          |---dev 开发模式配置项
|               |---index.js 开发模式配置项出口
|               |---crawl.js 爬虫相关配置项
|               |---db.js 数据库配置项
|               |---proxy.js 代理配置项
|               |---session.js 会话配置项
|               |---redis.js redis配置项
|               |---api.js API请求频率限制配置
|          |---prod 生产模式配置项
|          |---test 测试模式配置项
|    |---crawl 爬虫
|          |---index.js 爬虫主控文件
|          |---mapReqUrl.js 并发请求
|          |---fetchResult 爬虫核心
|    |---proxy 代理
|          |---index.js 可用代理检测模块
|    |---data 数据目录
|          |---config.json 爬虫配置文件
|    |---model 数据模型
|          |---index.js 模型出口
|          |---user.js 用户模型
|          |---crawl.js 爬虫模型
|          |---statistics.js API统计模型
|    |---router Web应用路由
|          |---utils 路由部分需要的辅助函数
|                |---verification.js 用户输入验证
|          |---index.js 路由出口
|          |---user.js 用户路由
|          |---crawl.js 爬虫接口路由
|          |---proxy.js 代理检测路由
|    |---utils 辅助函数
|          |---index.js 辅助函数出口
|          |---debug.js 调试模块
|          |---filter.js 用户输入过滤模块
|          |---sha.js 加密模块
|          |---splice.js 多维数组转化为一维数组
|          |---time.js 格式化时间
|          |---uuid.js 获取ID模块
|          |---isNaN.js 判断参数是否能转化为数字
|    |---test 测试文件
|          |---crawl.test.js 爬虫测试
|          |---router.test.js 路由测试
|          |---utils.test.js 功能函数测试
|    |---index.js 应用出口
|---static 静态资源文件夹
|---app.js 应用入口
```

## 核心代码
```javascript
const Koa = require("koa");
const superagent = require("superagent");
const cheerio = require("cheerio");
const app = new Koa();

app.use(async function(ctx, next) {
    if (ctx.request.path == "/" && ctx.request.method == "GET") {
        ctx.body = await new Promise((resolve, reject) => {
            superagent.get('https://cnodejs.org/')
                .end(function(err, _res) {
                    if (err) {
                        reject(err);
                    }
                    const $ = cheerio.load(_res.text);

                    $('.topic_title').each(function(idx, element) {
                        var $element = $(element);
                        items.push({
                            title: $element.attr('title'),
                            url: $element.attr('href')
                        });
                    })
                    resolve(items);
                })
        })
    } else {
        next();
    }
})

app.listen(3000);
```

## 使用

### 1.爬取深度

爬取深度指的是从初始网址经过几层到达数据所在网址。最大支持的爬取深度为3，推荐使用的最大爬取深度为2  

### 2.网页编码

目标网页的编码格式，默认为UTF-8

### 3.抓取模式

普通模式与分页模式

### 4.页码范围

在分页模式下，抓取的起止页码

### 5.目标网址

目标网址即要爬取的目标网站的网址。

普通模式下只需填写要抓取的网址即可。

分页模式下:

网址填写时，将网址中的页码改为*即可

例如:

CNode的分页网址

```https://cnodejs.org/?tab=good&page=10```

改为

```https://cnodejs.org/?tab=good&page=*```


### 6.选择器

选择器用来指出数据所在的位置，配合"输出格式"即可获得目标数据。填写需要用户具有基本的前端知识。

这里为了描述方便，将标签选择器分为两种，一种是a标签选择器与数据标签选择器。(当然，如果你想要的数据在a标签中，那么a标签选择器就是数据标签选择器)

> 当抓取深度为1，则一级选择器中填写数据选择器即可。

> 当抓取深度为2，则一级选择器中填写到达第二层页面的a标签选择器，二级选择器填写数据标签选择器。

> 当抓取深度为3，则一级选择器中填写到达第二层页面的a标签选择器，二级选择器中填写到达第三层页面的a标签选择器，三级选择器填写数据选择器即可。

填写示例:

深度为2

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic .content")`


`$(".topic_title a")`是指目标页面中所有类名为 topic_title 的元素中的a元素

`$(".topic .content")`指的是目标页面中类名为 topic 的元素下的类名为 content 的子孙元素

填写了两级选择器，说明目标数据在当前页面(即配置页面"目标网址"填写的网址)的下一层，则一级选择器需要指出到达下一层页面的a标签选择器。二级选择器填写的是下一层页面中的数据标签选择器

更多选择器填写规则，参考[cheerio](https://www.npmjs.com/package/cheerio)。

### 7.输出格式

输出格式指的是输出哪些结果。

由标签选择器指出数据所在的位置后，还需要进一步使用标签选择器和属性选择器来获得数据。

这里需要写成JSON格式，参考写法如下：

```
{
    "name":"$element.find('.c-9 .ml-20 a').text()",
    "age":"$element.children('.c-9').next().text()"
}
```

键部分可以随意指定，值部分填写需要一定的规则。

**$element**是指"选择器"中填写的数据标签选择器。(结合"选择器"给出的示例，$element指的是$(".topic .content")）

键为name的值指 "选择器"筛选出的元素下的类名为c-9的元素下的类名ml-20下的a元素中的文本

键为age的值指 "选择器"筛选出的元素下的类名为c-9的元素下一个元素的文本内容
 

***

值得注意的是，当你需要的数据种类只有1种，你完全可以在"选择器"中填写标签选择器时，直接将标签定位到目标元素，在"输出格式"中，填写属性选择器即可。

但往往我们需要的数据种类不止一种，所以在填写"选择器"部分时，需要填写的数据标签选择器要将所有需要的数据包裹在内，所以甚至可以填写$("body")这样的数据选择器。在填写"输出格式"的值部分，需要填写一些选择器指明数据详细位置，最后使用属性选择器即可获得数据。

同样结合上文给出的示例，

如果我要想获得 'name' 值这一类数据，

那么"选择器"可以这样写

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic .content .c-9 .ml-20 a")`

'输出格式'可以这样写
```
{
    "name":"$element.text()"
}
```

或者

'选择器':

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic").find('.content .c-9 .ml-20 a')`

'输出格式':
```
{
    "name":"$element.text()"
}
```

或者

'选择器':

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic")`

'输出格式':
```
{
    "name":"$element.find('.content .c-9 .ml-20 a').text()",
}
```

或者

'选择器':

一级选择器:`$(".topic_title a")`

二级选择器:`$("body")`

'输出格式':
```
{
    "name":"$element.find('.topic .content .c-9 .ml-20 a').text()"
}
```


常用的属性选择器有text(),html(),attr()这三种

text()选择的是目标元素中的文本内容

html()选择的是目标元素的HTML代码

attr()选择的是目标元素标签中的某个属性值。需要填写参数，比如$element.attr('url')指的是获取目标元素标签中的url属性值

### 8.代理模式

即抓取数据是否需要使用HTTP代理。有3种模式，内置代理,无代理与自定义代理。

内置代理使用[西刺代理](http://xicidaili.net/)或[FreeProxyList](https://free-proxy-list.net/)可用的代理地址发出请求。

自定义代理模式需要用户自己填写可用代理。

无代理使用部署服务器IP进行请求

注:

(1)自定义代理地址填写不符合正常IP地址的话，系统默认使用无代理模式。

(2)代理质量参差不齐，所以可能响应失败。所以当响应失败时，请重新提交。

### 9.结果预览

返回结果中

state表示抓取状态，值为 true 或者 false 

time值为数据的更新时间。

data值为抓取结果，格式为数组。

msg备注

### 10.生成API

数据接口只在用户登录情况下生成。点击"生成API"按钮，后台会记录当前的爬虫配置，请求API时会在合适的情况下调用爬虫进行响应。

### 11.更新间隔(后台管理配置项)

两次API调用间隔时间如果在"更新间隔"时间段内，则直接调用数据库数据进行响应，否则将调用爬虫程序进行响应。所有初始生成的API默认更新间隔为0，表示不更新数据，直接从数据库读取数据。

注意根据需求合理配置该项，"更新间隔"配置值较大或者为0，API平均响应速度快，但时效性较差；配置值较小，API平均响应速度慢，但时效性较好。

***注意:在点击"生成API"之后，在进行API"编辑"操作调整"更新间隔"之前，一定要到"管理面板"中，点击一次生成的API链接完成抓取数据的初始化。否则调用API返回结果永远为空。补救措施:当发现返回结果为空，可再次进行API“编辑”操作，将"更新间隔"调整为0，点击API链接初始化一次数据，初始化成功之后即可调整"更新间隔"***

### 12.标签(后台管理配置项)
为了方便用户找到某一类的API，添加标签功能

### 13.开放权限(后台管理配置项)
控制是否将API共享。API权限开放后，即可在"API Store"面板看到该API信息

### 14.描述信息(后台管理配置项)
API描述信息。

## 数据接口调用示例

Node.js后端
```javascript
const express = require('express');
const axios = require("axios");
const router = express.Router();

router.get('/douban/movie', function(req, res, next) {
    axios.get("http://splider.docmobile.cn/interface?name=luckyhh&cid=1529046160624").then(_res => {
        if(_res.data.state){
            res.render('douban', { title: 'douban', content: _res.data.data });
        }else{
            res.send("请求失败");
        }
    }).catch(err => {
        console.error(err);
    });
});
```
***注意: 程序后台对API调用频率进行限制，示例为了方便直接将API链接请求结果构造到了模板中，实际调用时，请将请求结果保存到redis或数据库中，否则会造成数据响应失败的情况***

## 示例配置参考

> * [WebSpider参考配置](https://docmobile.cn/artical_detiail/luckyhh/1528369921460)

> * [基于WebSpider的在线新闻模块开发](https://docmobile.cn/artical_detiail/luckyhh/1528989508215)


## 更新日志

[WebSpider更新日志](/docs/history.md)

## 注意
```
https://spider.docmobile.cn/
```
为预览地址，不推荐使用到实际项目中。由此带来的损失，由用户自行承担

## TODO
- [x] 对GBK网页格式的抓取支持
- [x] 支持模式选择，可抓取分页列表
- [x] API调用频率限制
- [x] API调用统计(按时间统计)
- [x] 定义请求头
- [x] 添加HTTP代理
~~- [x] JSONP调用支持~~
- [x] 前后端分离,[WebSpiderPanel](https://github.com/LuckyHH/WebSpiderPanel)
- [ ] 超级用户后台管理面板
- [x] 普通用户信息管理，查看自己API调用情况

## 协议

MIT
