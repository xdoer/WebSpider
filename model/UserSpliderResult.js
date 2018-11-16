//保存每次抓取结果

const monk = require("monk");
const url = require("../conf/conf").DataBaseUrl;
const db = monk(url);
const collection = db.get('userSpliderResult')

class Result {
    constructor(obj) {
        this.cid = obj.cid;
        this.time = obj.time;
        this.result = obj.result;
    }
    save() {
        const obj = {
            cid: this.cid,
            time: this.time,
            result: this.result
        }
        return collection.insert(obj)
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

Result.get = function(obj) {
    return collection.find(obj).then((docs) => {
        return docs;
    }).catch((err) => {
        return err;
    }).then((result) => {
        db.close();
        return result;
    });
}

Result.update = function(id, data) {
    return collection.update(id, { $set: data }).then(res => {
        return res;
    }).catch((err) => {
        return err;
    }).then((result) => {
        db.close();
        return result;
    })
}

Result.delete = function(cid) {
    return collection.remove(cid).then(res => {
        return res;
    }).catch(err => {
        return err;
    }).then(res => {
        db.close();
        return res;
    })
}

module.exports = Result;