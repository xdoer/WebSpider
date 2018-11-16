function formatResult(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            result.push(data[i][j]);
        }
    }
    return result;
}

module.exports = formatResult;