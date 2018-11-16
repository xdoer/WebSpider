const monk = require("monk");
const url = require("../conf/conf").DataBaseUrl;
const db = require('monk')(url);

const collection = db.get('users');

class User {
    constructor(obj) {
        this.name = obj.name;
        this.password = obj.password;
        this.userid = obj.userid;
    };
    save() {
        const item = {
            name: this.name,
            password: this.password,
            userid: this.userid
        }
        return collection.insert([item])
            .then((docs) => {
                return docs;
            }).catch((err) => {
                return err;
            }).then((result) => {
                db.close();
                return result;
            });
    };
}

//flag参数用来判断要不要关闭连接
//查询用户存不存在，不存在的话还要使用save函数存储，此时不能关闭连接
//获取用户所有信息时，则必须关闭连接。
User.get = function(name, flag) {
    return collection.find({ name }).then((docs) => {
        return docs;
    }).catch((err) => {
        return err;
    }).then((result) => {
        if (flag) {
            db.close();
        }
        return result;
    });
}

module.exports = User;