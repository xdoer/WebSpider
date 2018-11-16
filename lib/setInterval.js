/*
自动更新逻辑:
    递归调用计时函数，设定定时任务，进行爬虫调用。
    当爬虫正确执行，则将结果更新到数据库，并且设定1天后更新数据。
    当爬虫执行失败，设定定时任务，5秒后再次进行爬虫调用，直到爬虫正确执行
    但是当目标网站出现改版或者闭站等问题，程序还在递归调用，请求目标网站，所以设定items数组，保存每个定时任务，且设定index值，
    保存它调用失败的次数，如果调用失败次数达到5次，则程序不再进行该目标网站的数据更新。直到用户下次请求该数据接口API，如果目标
    网站没问题，则重新启动定时任务。不过在这时，一般是目标网站出现了问题,程序会返回错误。
*/


const schedule = require("node-schedule");
const getProxy = require("./proxy");
const formatResult = require("./formatResult");
const itime = require("./time");

//更新数据用
const Result = require("../model/UserSpliderResult");

//爬虫
const splider = require("./splider");

//保存每个定时任务中的数据接口
const items = [];

//设置爬虫定时任务
//从生成数据接口开始，每隔1天进行数据请求
module.exports = function(cid, obj) {
    //定时器时间
    let time = new Date();

    //数据更新状态
    let state = 1;

    //为每个数据对象初始化，index记录失败请求数量，当请求失败次数大于10，则数据不会更新
    if (!items.some(item => { return item.cid === cid; })) {
        const item = {
            cid: cid,
            index: 1
        }
        items.push(item);
    }

    function getTime() {
        //数据成功更新,则下次更新在1天后，否则2分钟后继续。
        //当连续五次自动更新失败，说明目标网站可能出现问题，则不自动进行数据更新，只能等到用户下次调用该数据接口时，再进行定时器初始化
        if (state === 1) {
            return new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1, time.getHours() + Number.parseInt(Math.random() * 2), time.getMinutes() + Number.parseInt(Math.random() * 60), time.getSeconds());
        } else if (state === 2) {
            return new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), time.getMinutes() + 2, time.getSeconds());
        } else if (state === 3) {
            return new Date(time.getFullYear() + 10, time.getMonth(), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
        }
    }


    function setTask() {
        schedule.scheduleJob(getTime(), async function() {
            time = new Date();

            const time2 = new Date();
            time2.setHours(time2.getHours() + 8);

            try {

                //爬虫请求成功
                const result = formatResult(await splider(obj.targetUrl, obj.targetTags, obj.classNum, obj.icontent, obj.mycharset, obj.mode, obj.startPage, obj.endPage, await getProxy(obj)));
                Result.update({ cid }, { result, time: time2 });
                state = 1;

                console.log(`${itime()} 数据更新成功.`);

            } catch (e) {
                state = 2;
                console.error(`${itime()} 定时任务抓取出错,错误详情:${e}`);

                for (let i = items.length - 1; i >= 0; i--) {
                    if (items[i].cid == cid) {
                        if (items[i].index++ === 5) {
                            state = 3;
                            console.error(`${itime()} 定时任务抓取出错,目标网站出现问题`);

                            const result = `目标站点可能出现问题，该API已失效，请重新生成数据接口API`;
                            Result.update({ cid }, { result, time: time2 });
                        };
                        break;
                    }
                }
            }
            setTask();
        });
    }
    setTask();
};