const axios = require("axios");

//处理代理逻辑
function getAllProxy(url) {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            resolve(res.data.data);
        }).catch(e => {
            reject(e);
        })
    })
}

async function getProxy(obj) {
    let proxys = [];
    if (obj.proxymode === '西刺代理') {
        proxys = await getAllProxy("https://proxys.herokuapp.com/fetchanswer");
    } else if (obj.proxymode === '国外代理') {
        proxys = await getAllProxy("https://proxys.herokuapp.com/fetchanswer?testSrc=2");
    } else if ((obj.proxymode === '自定义代理')) {
        //判断输入是否以['http:开头,以']结尾
        //用户自定义代理验证失败，将不使用代理
        if (/^\['http:.*\']/g.test(obj.inputproxy)) {
            const proxy = eval(obj.inputproxy);
            const uesful = [];

            //判断输入的每个代理是否正确，不正确的话，默认不使用代理
            for (let i = 0; i < proxy.length; i++) {
                if (!/^http:\/\/((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?):\d{3,5}/g.test(proxy[i])) {
                    break;
                } else {
                    uesful.push(proxy[i]);
                    if (uesful.length === proxy.length) {
                        proxys = proxy;
                    }
                }
            }
        }
    }
    return proxys;
}

module.exports = getProxy;