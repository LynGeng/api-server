const db = require('../db');
const bcrypt = require('bcryptjs');

// 获取用户信息
const getUserInfo = (req, res) => {
    const select = 'select id, username, nickname, email, user_pic from ev_users where id = ?';
    db.query(select, req.auth.id, (err, results) => {
        if(err) return res.cc(err);
        if(results.length !== 1) return res.cc('获取用户信息失败, 请稍后再试!');
        res.send({
            status: 0,
            msg: '用户信息获取成功',
            data: results[0]
        });
    });
}

// 更新用户信息
const updateUserInfo = (req, res) => {
    const update = 'update ev_users set ? where id = ?';
    db.query(update, [req.body, req.body.id], (err, results) => {
        // 执行sql语句失败
        if(err) return res.cc(err);
        // 执行语句成功,影响行数不为1
        if(results.affectedRows !== 1) return res.cc('更新信息失败,请稍后再试!');
        res.cc('更新信息成功!', 0);
    });
}

// 修改密码
const updatePassword = (req, res) => {
    const select = 'select * from ev_users where id=?';
    db.query(select, req.auth.id, (err, results) => {
        if(err) return res.cc(err);
        if(results.length !== 1) return res.cc('查询用户信息失败,请稍后再试!');

        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if(!compareResult) return res.cc('原密码输入错误!');

        const update = 'update ev_users set password = ? where id = ?';
        // 对新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(update, [newPwd, req.auth.id], (err, results) => {
            if(err) return res.cc(err);
            if(results.affectedRows !== 1) return res.cc('更新用户密码失败,请稍后再试!');
            res.cc('更新密码成功', 0);
        });
    });
}

// 更新用户头像
const updateAvatar = (req, res) => {
    const upate = 'update ev_users set user_pic = ? where id = ?';
    db.query(upate, [req.body.avatar, req.auth.id], (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) return res.cc('更新用户头像失败,请稍后再试!');
        res.cc('更新头像成功', 0);
    });
}

module.exports = {
    getUserInfo,
    updateUserInfo,
    updatePassword,
    updateAvatar
}