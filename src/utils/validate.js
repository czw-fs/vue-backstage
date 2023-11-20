export function validateUsername(rule,value,callback){
    if (value.length < 3 || value.length > 20) {
        callback(new Error('密码长度不能小于3或大于20'));
    } else {
        callback();
    }
}