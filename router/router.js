// 导入express包
const express = require('express');
// 导入路由对象
const router = express.Router();

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入部分路由模块
const login = require('./login');
const userinfo = require('./userinfo');

// 整合全部路由
const all = {
    ...login,
    ...userinfo,
}
// 自动注册路由
Object.keys(all).forEach(url => {
    if(all[url].schema) {// 路由对象中含有校验验证的添加中间件
        router[all[url].type](url, expressJoi(all[url].schema), all[url].fn);
    } else {
        router[all[url].type](url, all[url].fn);
    }
});

module.exports = router;
