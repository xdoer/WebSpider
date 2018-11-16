const time = () => {
    const time = new Date();
    time.setHours(time.getHours() + 8);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hours = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    return [year, month, date].map(format).join('-') + ' ' + [hours, minute, second].map(format).join(':');
}

const format = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
}
module.exports = time;