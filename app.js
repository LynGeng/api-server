const express = require('express');
const app = express();

const joi = require('joi');

// 导入cors中间件，解决跨域问题
const cors = require('cors');
app.use(cors());

// 配置解析表单数据的中间件 
// application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({extended: false}));

// 设置全局中间件挂载一个 res.cc函数处理错误信息
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        res.send({
            status,
            msg: err instanceof Error? err.message : err
        });
    }
    next();
});

// 在路由之前配置解析token的中间件
const {expressjwt} = require('express-jwt');
const config = require('./config');
app.use(expressjwt({secret: config.jwtSecretKey, algorithms: ["HS256"],}).unless({path: [/^\/api\//]}));


// 导入并使用路由模块
const router = require('./router/router');
app.use(router);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if(err instanceof joi.ValidationError) {
        return res.cc(err);
    }
    // token验证失败后的错误
    if(err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败!');
    }
    // 未知的错误
    res.cc(err);
})

app.listen(3007, ()=>{ 
    const date = new Date();
    const dataString = `${date.getFullYear()}-${date.getMonth()-1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(dataString,'server running at http://127.0.0.1:3007'); 
});