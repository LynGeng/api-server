// 导入需要的验证规则对象
const {reg_login_schema} = require('../schema/login');
// 导入处理函数
const { register, login } = require('../router_handler/login');

module.exports = {
    "/api/register": { type: 'post', fn: register, schema: reg_login_schema},
    "/api/login": { type: 'post', fn: login, schema: reg_login_schema }
}