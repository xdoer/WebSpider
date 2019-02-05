# WebSpiderPanel

WebSpider在线爬虫系统采用了前后端分离设计。本文档将对前端面板进行简要说明

## 技术栈
前端面板构建采用Vue.js框架，使用Element-UI进行界面 UI 构建。

## 主要功能
面板主要分为7个模块:
>* WebSpider: 爬虫面板配置预览模块
>* HttpProxyLite: 代理检测模块
>* API Store: API分享模块
>* 管理面板: 后台管理模块(包括编辑API信息、查看API详情两个子模块)
>* 使用说明: WebSpider使用说明
>* 更新日志: 在线爬虫更新日志模块

## 其他
`/static/[dev/prod]`目录中内置了打包后的面板文件。因为系统采用开发和生产的两种不同环境,采用了两个域,因而前端需要打包两个不同的版本，才能在不同环境下顺利的请求到服务器数据。

如果需要将程序部署到实际生产环境，请先到[WebSpiderPanel](https://github.com/LuckyHH/WebSpliderPanel)克隆面板文件,修改`/src/config/index.js`文件中的参数，保存后打包，用新生成的`/dist`中的文件替换本项目`/static/prod`中文件即可。