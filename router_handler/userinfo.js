const db = require('../db');
const bcrypt = require('bcryptjs');

// 获取用户信息
const getUserInfo = (req, res) => {
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id = ?';
    db.queryHandler({req, res, sql, params: req.auth.id, fail: '获取用户信息失败, 请稍后再试!'}).then((results) => {
        res.send({
            status: 0,
            msg: '用户信息获取成功',
            data: results[0]
        });
    });
}

// 更新用户信息
const updateUserInfo = (req, res) => {
    const sql = 'update ev_users set ? where id = ?';
    db.queryHandler({req, res, sql, params: [req.body, req.body.id], fail: '更新用户信息失败,请稍后再试!'}).then(() => {
        res.cc('更新信息成功!', 0);
    });
}

// 修改密码
const updatePassword = (req, res) => {
    const sql = 'select * from ev_users where id=?';
    db.queryHandler({req, res, sql, params: req.auth.id, fail: '查询用户信息失败，请稍后再试！'}).then((results) => {
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if(!compareResult) return res.cc('原密码输入错误!');
        // 更新用户密码sql
        const sql = 'update ev_users set password = ? where id = ?';
        // 对新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.queryHandler({req, res, sql, params: [newPwd, req.auth.id], fail: '更新用户密码失败,请稍后再试!'}).then(() => {
            res.cc('更新密码成功', 0);
        });
    });
}

// 更新用户头像
const updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic = ? where id = ?';
    db.queryHandler({req, res, sql, params: [req.body.avatar, req.auth.id], fail: '更新用户头像失败,请稍后再试!'}).then(() => {
        res.cc('更新头像成功', 0);
    });
}

module.exports = {
    getUserInfo,
    updateUserInfo,
    updatePassword,
    updateAvatar
}