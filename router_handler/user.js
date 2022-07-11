const db = require('../db/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 注册
const register = (req, res) => {
    // 获取到客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 对表单中的信息进行合法性校验，不使用传统的方式，而是使用中间件形式校验数据
    // if (!userinfo.username || !userinfo.password) {
    //     return res.cc('用户名或密码不合法！');
    // }
    // 定义sql语句，查询用户名是否被占用
    const sqlSelect = 'select * from ev_users where username = ?';
    const nonUser = new Promise((resolve, reject) => {
        db.query(sqlSelect, [userinfo.username], (err, results) => {
            // 执行sql语句失败
            if (err) reject(err);
            // 判断用户名是否被占用
            if (results.length > 0) reject('用户名被占用，请更换其他用户名！');
            resolve();
        });
    });
    nonUser.then(() => {
        // 调用 bcrypt.hashSync()对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        const sqlInsert = 'insert into ev_users set ?';
        db.query(sqlInsert, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 执行sql语句失败
            if (err) return res.cc(err);
            // 判断影响行数是否等于1
            if (results.affectedRows !== 1) return res.cc('注册失败，请稍后再试！');
            // 注册用户成功
            res.cc('注册成功！', 0);
        });
    }, (e) => {
        // res.cc()为全局中间件中定义的函数
        res.cc(e);
    });
}

// 登录
const login = (req, res) => {
    const userinfo = req.body;
    const sqlSelect = 'select * from ev_users where username = ?';
    db.query(sqlSelect, [userinfo.username], (err, results) => {
        // 执行sql语句失败
        if (err) res.cc(err);
        // 判断用户名是否被占用
        if (results.length !== 1) res.cc('登录失败！');
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if(!compareResult) return res.cc('登录失败！');

        const user = {...results[0], password: '', user_pic: ''}
        
        res.cc('ok', 0);
    });
}

const handler = {
    register,
    login
}

module.exports = handler;

