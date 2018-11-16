const superagent = require('superagent');
const cheerio = require('cheerio');
const durl = require('url');
const time = require('./time');
const reqHeader = require('./header');
require('superagent-charset')(superagent);
require('superagent-proxy')(superagent);

async function fetchResult(ourl, tags, num, content, tag_num, mycharset, proxys, fn) {
    if (proxys) {
        superagent.get(ourl).set(reqHeader).proxy(proxys).charset(mycharset).end(function(err, res) {
            bound(err, res);
        })
    } else {
        superagent.get(ourl).set(reqHeader).charset(mycharset).end(function(err, res) {
            bound(err, res);
        })
    }

    function bound(err, res) {
        if (err) {
            console.error(`${time()} 链接${ourl}请求出错，错误详情:${err}`);
            fn(err);
        } else {
            //保存抓取结果
            let myresult = [];

            //解析网页
            let $ = cheerio.load(res.text);

            //标签选择器
            let target = null;

            //"输出结果"格式中属性选择器解析状态
            let state = true;
            let errmsg = '';

            try {
                //将用户输入的标签选择器整合到上下文
                //在koa路由那里已经验证过用户输入
                target = eval(tags[tag_num]);

                target.each(function(idx, element) {
                    var $element = $(element);

                    //num是爬取深度,tag_num是标签选择器数组下标
                    //当爬取深度等于标签选择器数组下标值，说明此时已经到达目标页面
                    //否则此时还在中间页面，需要继续解析a标签选择器获得下一级的URL
                    if (num == tag_num + 1) {
                        let i_result = {};

                        //将"输出结果"中的键和值分别保存到数组
                        let i_key = Object.keys(content);
                        let i_value = Object.values(content);

                        //解析数据
                        i_key.forEach(function(key, idx) {
                            try {
                                i_result[key] = eval(i_value[idx]);
                            } catch (e) {
                                state = false;
                                errmsg = e.toString();

                                console.error(`${time()} 属性选择器解析失败，失败详情 ${e}`)
                            }
                        });

                        myresult.push(i_result);
                    } else {
                        try {
                            //通过a标签选择器获取中间页面的URL
                            let i_result = durl.resolve(ourl, $element.attr('href'));
                            myresult.push(i_result);
                        } catch (e) {
                            state = false;
                            errmsg = `中间级的标签选择器应为a标签选择器，以使得程序顺利解析到下一级页面。`;

                            console.error(`${time()} 中间页面的a标签选择器解析失败 ， 错误详情:${e}`)
                        }


                    }
                });

                state ? fn(null, myresult) : fn(errmsg);

            } catch (e) {
                console.error(`${time()} 标签选择器解析出错，错误详情:${e}`);
                fn(e);
            }
        }
    }

}

module.exports = fetchResult;