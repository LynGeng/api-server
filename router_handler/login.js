// 导入数据库操作模块
const db = require('../db/index');
// 导入密码加密的包
const bcrypt = require('bcryptjs');
// 导入jwt包
const jwt = require('jsonwebtoken');
// 导入全局配置文件对象
const config = require('../config');

// 注册
const register = (req, res) => {
    // 获取到客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 定义sql语句，查询用户名是否被占用
    const sqlSelect = 'select * from ev_users where username = ?';
    db.queryHandler({req, res, sql: sqlSelect, params: userinfo.username, fail: '用户名被占用，请更换其他用户名！'}).then(() => {
        // 调用 bcrypt.hashSync()对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        const sqlInsert = 'insert into ev_users set ?';
        db.queryHandler({
            req, res, sql: sqlInsert, 
            params: { username: userinfo.username, password: userinfo.password },
            fail: '注册失败，请稍后再试！'
        }).then(() => {
            // 注册用户成功
            res.cc('注册成功！', 0);
        })
    });
}

// 登录
const login = (req, res) => {
    const userinfo = req.body;
    const sqlSelect = 'select * from ev_users where username = ?';
    db.queryHandler({req, res, sql: sqlSelect, params: userinfo.username, fail: '登录失败！'}).then((results) => {
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if(!compareResult) return res.cc('登录失败！');
        const user = {...results[0], password: '', user_pic: ''};
        // 对用户信息进行加密,生成token
        const token ='Bearer ' + jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn});
        // 将token返回给客户端
        res.send({
            status: 0,
            msg: '登录成功!',
            token
        });
    });
}


module.exports = {
    register,
    login
};

