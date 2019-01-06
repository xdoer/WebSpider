WebSpider
===============

基于NodeJS的在线爬虫系统。支持提供在线数据API。

1、当你想在自己的网站添加一个小的新闻模块时，你可以利用WebSpider爬虫爬取指定网站的数据，然后在后端或者前端请求数据接口，再将获得的数据构造到你的网页上。

2、当你想做个聚合网站或者聚合app时，你可以利用WebSpider爬取各大站点的数据，然后调用API，构造数据到自己的APP中。

...

基于此，WebSpider诞生了。

## 特性

> * 简单、方便。只要掌握简单的网页知识，即可利用WebSpider在线爬虫系统，进行简单的配置之后，可进行数据抓取预览。

> * 功能强大。支持抓取预览，定制输出，生成API，API管理，查看分享，登录注册等功能。

> * 响应速度快。抓取结果保存在数据库中，每天定时更新数据，数据接口响应数据库内容。


## 本地测试
1、安装Nodejs,MongoDB数据库,Git,

2、保证程序有读写文件权限(日志文件需要动态写入)

3、运行代码
```
git clone https://github.com/LuckyHH/WebSpider.git
cd WebSpider
npm install
```

4、修改配置文件(src/config)

5、根目录下运行`npm start`启动项目

6，打开```http://localhost:3000```

## 核心代码
```
const Koa = require("koa");
const superagent = require("superagent");
const cheerio = require("cheerio");
const app = new Koa();

app.use(async function(ctx, next) {
    if (ctx.request.path == "/" && ctx.request.method == "GET") {
        ctx.body = await new Promise((resolve, reject) => {
            superagent.get('https://cnodejs.org/')
                .end(function(err, sres) {
                    if (err) {
                        reject(err);
                    }
                    var $ = cheerio.load(sres.text);

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

## 目录
```
|---docs 模块说明文档
|    |---crawl.md 爬虫说明
|---log 日志文件
|    |---error 错误日志
|    |---running 运行日志
|---src 源代码
|    |---assets 静态资源
|          |---images 图片
|          |---favicon.ico 网站icon
|    |---config 配置
|          |---index,js 配置项出口
|          |---crawl.js 爬虫相关配置项
|          |---db.js 数据库配置项
|          |---proxy.js 代理配置项
|          |---session.js 会话配置项
|    |---crawl 爬虫
|          |---index.js 爬虫主控文件
|          |---mapReqUrl.js 并发请求
|          |---fetchResult 爬虫核心
|          |---proxy.js 获取代理
|          |---test.js 测试文件
|    |---data 数据目录
|          |---proxies.json 获取到的代理
|    |---model 数据模型
|          |---index.js 模型出口
|          |---user.js 用户模型
|          |---crawl.js 爬虫模型
|    |---router Web应用路由
|          |---utils 路由部分需要的辅助函数
|                |---verification.js 用户输入验证
|          |---index.js 路由出口
|          |---user.js 用户路由
|          |---crawl.js 爬虫接口路由
|    |---utils 辅助函数
|          |---index.js 辅助函数出口
|          |---debug.js 调试模块
|          |---filter.js 用户输入过滤模块
|          |---sha.js 加密模块
|          |---splice.js 多维数组转化为一维数组
|          |---time.js 格式化时间
|          |---uuid.js 获取ID模块
|    |---index.js 应用入口
|---static 静态文件文件夹
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

选择器用来指出数据所在的位置，配合'输出结果定制'即可获得目标数据。填写需要用户具有基本的前端知识。

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

填写了两级选择器，说明目标数据在当前页面(即配置页面'目标网址'填写的网址)的下一层，则一级选择器需要指出到达下一层页面的a标签选择器。二级选择器填写的是下一层页面中的数据标签选择器


填写同样支持调用一些内置函数来辅助进行数据定位

如:

```
$(".topic").find('.content')

$(".topic").children('.content')

$(".topic").next().children('.content')

$(".topic").children('.content').next().find('.article')
```

更多选择器填写规则，参考[cheerio](https://www.npmjs.com/package/cheerio)。

### 7.输出结果定制。 

输出结果定制指的是输出哪些结果。

由标签选择器指出数据所在的位置后，还需要进一步使用标签选择器和属性选择器来获得数据。

这里需要写成JSON格式，参考写法如下：

```
{
    "name":"$element.find('.c-9 .ml-20 a').text()",
    "age":"$element.children('.c-9').next().text()"
}
```

键部分可以随意指定，值部分填写需要一定的规则。

**$element**是指'选择器'中填写的数据标签选择器。(结合'选择器'给出的示例，$element指的是$(".topic .content")）

键为name的值指 '选择器'筛选出的元素下的类名为c-9的元素下的类名ml-20下的a元素中的文本

键为age的值指 '选择器'筛选出的元素下的类名为c-9的元素下一个元素的文本内容
 

***

值得注意的是，当你需要的数据种类只有1种，你完全可以在'选择器'中填写标签选择器时，直接将标签定位到目标元素，在'输出结果定制'中，填写属性选择器即可。

但往往我们需要的数据种类不止一种，所以在填写'选择器'部分时，需要填写的数据标签选择器要将所有需要的数据包裹在内，所以甚至可以填写$("body")这样的数据选择器。在填写"输出结果定制"的值部分，需要填写一些选择器指明数据详细位置，最后使用属性选择器即可获得数据。

同样结合上文给出的示例，

如果我要想获得 'name' 值这一类数据，

那么'选择器'可以这样写

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic .content .c-9 .ml-20 a")`

'输出结果定制'可以这样写
```
{
    "name":"$element.text()"
}
```

或者

'选择器':

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic").find('.content .c-9 .ml-20 a')`

'输出结果定制':
```
{
    "name":"$element.text()"
}
```

或者

'选择器':

一级选择器:`$(".topic_title a")`

二级选择器:`$(".topic")`

'输出结果定制':
```
{
    "name":"$element.find('.content .c-9 .ml-20 a').text()",
}
```

或者

'选择器':

一级选择器:`$(".topic_title a")`

二级选择器:`$("body")`

'输出结果定制':
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

即抓取数据是否需要使用HTTP代理。有2种模式模式，内置代理与自定义代理。

内置代理使用[FreeProxyList](https://free-proxy-list.net/)可用的代理地址发出请求。

自定义代理模式需要用户自己填写可用代理。

注:

(1)自定义代理地址填写不符合正常IP地址的话，系统默认使用无代理模式。

(2)代理质量参差不齐，所以可能响应失败。所以当响应失败时，请重新提交。

(3)[HttpProxy](http://httpproxy.docmobile.cn)提供API支持

### 9.结果预览

返回结果中

state表示抓取状态，值为 true 或者 false 

time值为数据的更新时间。

data值为抓取结果，格式为数组。


### 10.生成数据接口

数据接口只在用户登录情况下生成。

### 11.查看分享
WebSpider 左边栏有近期用户分享的API，贴左边屏幕有个icon，点击会滑动出所有用户分享的API。

界面为了美观，隐藏了滚动条，在页面中，所有被遮挡的部分均可以滚动。

### 12.数据自动更新机制
(1)自API生成起，程序每24小时更新一次数据，time值为更新数据的时间(不管数据更新成功或者失败，time值都会更新)

(2)当应用意外崩溃重启，所有API自动更新失效，直到用户重新请求API。当请求API时，程序发现请求时间比数据库保存的数据更新时间大24小时，会调用爬虫程序并响应结果，time 值为API请求的时间，此时响应时间稍长，同时程序将重新启动自动更新机制，自动更新该API数据。

(3)当自动更新机制更新某个API数据时，如果连续5次请求失败，说明目标网站可能闭站，改版，或者封了我服务器的IP，程序将不会再更新该API数据。当用户在数据更新时间(即time值)的24小时后调用API，会调用爬虫程序抓取数据进行响应，此时程序将重新启动定时任务，自动更新数据，如果5次请求失败，就不会再更新数据，在更新时间的24小时后，用户再次调用API，程序调用爬虫程序抓取数据进行响应。。。


## 数据接口调用示例

### 1.前端调用示例

JSONP 的调用方式
```
<script>
    function callback(obj) {
        if(obj.data.state){
            //obj.data.data数据处理
        }else{
            console.error("请求失败")
        }
    }
</script>
<script src="http://localhost:3000/interface?name=luckyhh&cid=1531671500898&cb=callback"></script>
```
调用时，只需要在数据接口后添加 &cb = 函数名 即可。


### 2.后端调用示例:
```
Node.js后端
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

ejs模板页面
<ul>
        <%
                for(let i = 0 ; i < content.length ; i++){
        %>
            <li>
                <h3>
                    <%=content[i].name%>
                </h3>
                <img src="<%=content[i].image_src%>" alt="<%=content[i].name%>"><br>
                <span>导演:
                    <%=content[i].director%>
                </span>
                <br>
                <span>编剧:
                    <%=content[i].screenwriter%>
                </span>
                <br>
                <span>主演:
                    <%=content[i].starring%>
                </span>
                <br>
                <span>
                    得分:<%=content[i].score%>
                </span>
                <br>
                <p>简介:
                    <%=content[i].brief%>
                </p>
            </li>
        <%
                }
        %>
    </ul>
```


## 示例配置参考

> * [WebSpider参考配置](https://docmobile.cn/artical_detiail/luckyhh/1528369921460)

> * [基于WebSpider的在线新闻模块开发](https://docmobile.cn/artical_detiail/luckyhh/1528989508215)


## 更新日志

[WebSpider更新日志](https://docmobile.cn/artical_detiail/luckyhh/1530767352093)

## 注意
```
https://splider.herokuapp.com/
```
为预览地址，不推荐使用到实际项目中。

## TODO
- [x] 对GBK网页格式的抓取支持
- [x] 支持模式选择，可抓取分页列表
- [x] 定义请求头
- [x] 添加HTTP代理
- [x] JSONP调用支持
- [x] 前后端分离,[WebSpiderPanel](https://github.com/LuckyHH/WebSpiderPanel)

## 协议

MIT


