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

// 导入并使用路由模块
const router = require('./router/router');
app.use(router);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if(err instanceof joi.ValidationError) {
        return res.cc(err);
    }
    // 未知的错误
    res.cc(err);
})

app.listen(3007, ()=>{ 
    const date = new Date();
    const dataString = `${date.getFullYear()}-${date.getMonth()-1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(dataString,'server running at http://127.0.0.1:3007'); 
});