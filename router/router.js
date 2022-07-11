const express = require('express');

const router = express.Router();

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入部分路由模块
const user = require('./user');

// 整合全部路由
const all = {
    ...user
}
// 自动注册路由
Object.keys(all).forEach(url => {
    if(all[url].schema) {
        router[all[url].type](url, expressJoi(all[url].schema), all[url].fn);
    } else {
        router[all[url].type](url, all[url].fn);
    }
});

module.exports = router;
