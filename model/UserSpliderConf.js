const monk = require("monk");
const url = require("../conf/conf").DataBaseUrl;
const db = monk(url);
const collection = db.get('userSpliderConf')


//用户权限public值为1或2
//1为开放，2为封闭
class UserSpliderConf {
    constructor(obj) {
        this.user = obj.user;
        this.targetUrl = obj.targetUrl;
        this.targetTags = obj.targetTags;
        this.icontent = obj.icontent;
        this.classNum = obj.classNum;
        this.msg = obj.msg;
        this.public = obj.public;
        this.time = obj.time;
        this.cid = obj.cid;
        this.url = obj.url;
        this.mycharset = obj.mycharset;
        this.mode = obj.mode;
        this.startPage = obj.startPage;
        this.endPage = obj.endPage;
        this.proxymode = obj.proxymode;
        this.inputproxy = obj.inputproxy
    };
    save() {
        const item = {
            user: this.user,
            targetUrl: this.targetUrl,
            targetTags: this.targetTags,
            icontent: this.icontent,
            classNum: this.classNum,
            cid: this.cid,
            msg: this.msg,
            public: this.public,
            time: this.time,
            url: this.url,
            mycharset: this.mycharset,
            mode: this.mode,
            startPage: this.startPage,
            endPage: this.endPage,
            proxymode: this.proxymode,
            inputproxy: this.inputproxy
        }
        return collection.insert([item])
            .then((docs) => {
                return docs;
            }).catch((err) => {
                return err;
            }).then((result) => {
                db.close()
                return result;
            });
    }
}

UserSpliderConf.get = function(user, cid, public) {
    const obj = {};

    //判断参数构造查询对象
    user ? obj.user = user : null;
    cid ? obj.cid = cid : null;
    public ? obj.public = public : null;

    return collection.find(obj, { sort: { time: -1 } }).then((docs) => {
        return docs;
    }).catch((err) => {
        return err;
    }).then((result) => {
        db.close();
        return result;
    });
}

UserSpliderConf.update = function(findFlag, newValue) {
    return collection.update(findFlag, { $set: newValue }).then(res => {
        return res;
    }).catch((err) => {
        return err;
    }).then((result) => {
        db.close();
        return result;
    })
}

UserSpliderConf.delete = function(findFlag) {
    return collection.remove(findFlag).then(res => {
        return res;
    }).catch(err => {
        return err;
    }).then(res => {
        db.close();
        return res;
    })

}
module.exports = UserSpliderConf;