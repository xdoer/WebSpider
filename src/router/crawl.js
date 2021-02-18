/**
 * 爬虫配置信息路由
 */

const Router = require("koa-router");
const fetch = require("../crawl");
const verification = require("./utils/verification");
const router = new Router();

router
  /**
   * 抓取预览
   * @param {string} url 爬取的链接列表
   * @param {array} tags 分析的标签列表
   * @param {string} depth 抓取深度
   * @param {object} form 需要输出的形式
   * @param {string} charset 网页编码(utf-8,gbk)
   * @param {string} proxyMode 代理模式(无代理none，内置代理internal，自定义代理own)
   * @param {array} proxies 自定义代理提交的代理
   * @param {string} mode 抓取模式(普通模式与分页模式)
   * @param {string} start 分页模式下起始页码
   * @param {string} end 分页模式下终止页码
   */
  .post("/crawl/preview", async (ctx) => {
    // 前端使用 axios 进行请求，使用 qs 模块格式化 post 请求数据，数字会以字符串形式进行传递，JSON数据会变成对象
    let {
      url,
      tags,
      depth = "1",
      form,
      charset = "utf-8",
      proxyMode = "none",
      proxies = [],
      mode = "plain",
      start = "0",
      end = "0",
    } = ctx.request.body;

    // 参数验证
    const dataState = verification({
      url,
      tags,
      depth,
      form,
      charset,
      proxyMode,
      proxies,
      mode,
      start,
      end,
    });
    if (!dataState.state) {
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: dataState.msg,
        msg: "参数验证失败",
      };
      return;
    }

    /**
     * 分页请求模式下,构造请求链接数组
     * 链接中的页码部分用*替代
     */
    start = Number.parseInt(start);
    end = Number.parseInt(end);
    const urls =
      mode === "pagination"
        ? new Array(end - start).fill(url).map((n) => n.replace(/\*/i, start++))
        : [url];

    form = process.env.NODE_ENV === "test" ? form : JSON.parse(form);

    try {
      // 调用爬虫
      const res = await fetch({
        urls,
        tags,
        depth: Number.parseInt(depth),
        form,
        charset,
      });

      ctx.body = {
        state: res.state,
        time: new Date().toLocaleString(),
        data: res.data,
        msg: res.state ? "抓取成功" : "抓取失败",
      };
    } catch (e) {
      console.log("查看错误", e);
      ctx.body = {
        state: false,
        time: new Date().toLocaleString(),
        data: e,
        msg: "爬虫抓取数据出错",
      };
    }
  });

module.exports = router;
