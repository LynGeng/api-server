// 导入需要的验证规则对象
const {reg_login_schema} = require('../schema/user');

// 导入，自动注册
const { register, login } = require('../router_handler/user');

const user = {
    "/api/register": { type: 'post', fn: register, schema: reg_login_schema},
    "/api/login": { type: 'post', fn: login, schema: reg_login_schema }
}

module.exports = user;