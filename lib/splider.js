const mapReqUrl = require('./mapReqUrl');
const time = require('./time');

function concatAry(myary) {
    let arys = [];
    myary.forEach(function(ary) {
        arys = arys.concat(ary);
    });
    return arys;
}

//爬虫一级直接可以定制数据
//第二级需要第一级传来的链接才能继续爬，定制返回数据
//第三级需要第二级传来的链接才能继续爬，定制返回数据


//iurl指出初始抓取的网址
//tags指出抓取当前页面的目标
//num指出抓取深度
//content指出抓取目标页内容
//mycharset是页面编码
//page是分页模式标志位
//startPage是分页起始页码
//endPage是尾页码
//proxys是代理

async function splider(iurl, tags, num, content, mycharset, page, startPage, endPage, proxys) {
    //随机获取一个代理
    const proxy = proxys[Math.floor(Math.random() * proxys.length + 1) - 1];

    let mylinks = [];

    if (page === 'pagination' && !startPage) {
        startPage = 0;
    }
    // 分页模式下,链接构建
    if (page === 'pagination' && endPage && /[http|https]:\/\/.+\*/g.test(iurl)) {
        for (let i = startPage; endPage >= i; i++) {
            mylinks.push(iurl.replace('*', i));
        }
    } else {
        mylinks.push(iurl);
    }

    return mapReqUrl(mylinks, tags, num, content, 0, mycharset, proxy)
        .then((result) => {
            return bound(result, tags, num, content, 1, mycharset, proxy);
        }).then((result) => {
            return bound(result, tags, num, content, 2, mycharset, proxy);
        }).catch(err => {
            console.error(`${time()} 爬虫爬取失败,错误详情:${err}`);
            throw new Error(err);
        })
};

function bound(result, tags, num, content, tagnum, mycharset, proxy) {
    if (num > tagnum) {
        result = concatAry(result);
        return mapReqUrl(result, tags, num, content, tagnum, mycharset, proxy);
    } else {
        return result;
    }
}



module.exports = splider;