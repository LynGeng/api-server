const joi = require('joi');
const { updatePassword } = require('../router_handler/userinfo');

// 修改用户信息时的信息校验
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();

// 修改密码时的信息校验
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

// 用户头像的信息校验
const avatar = joi.string().dataUri().required();

module.exports.update_password_schema = {
    body: {
        oldPwd: password,
        // 1. joi.ref('oldPwd')表示newPwd的值必须和oldPwd的值保持一致
        // 2. joi.not(joi.ref('oldPwd'))表示newPwd的值不能等于oldPwd的值
        // 3. .concat()用于合并joi.not(joi.ref('old'))和password这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

module.exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

module.exports.update_avatar_schema = {
    body: {
        avatar
    }
}