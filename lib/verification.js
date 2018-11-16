//应为要整合用户输入到上下文，所有要验证用户输入

//不能包含require,不能包含 ; ，= , 

const v1 = /require/g;
const v2 = /[;=]/g;


module.exports = function(str) {
    return !v1.test(str) && !v2.test(str);
};