const db = require('../db');

// 获取文章分类信息
const getArticleCates = (req, res) => {
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc';
    db.queryHandler({ req, res, sql, fail: '未找到图书！' }).then((results) => {
        res.send({
            status: 0,
            msg: '查询成功！',
            data: results
        });
    });
}

// 新增文章分类信息
const addArticleCate = (req, res) => {
    const sql = 'select * from ev_article_cate where name=? or alias=?';
    db.queryHandler({ req, res, sql, params: [req.body.name, req.body.alias] }).then((results, err) => {
        if (err) return res.cc(err);
        if (results.length === 2) return res.cc('分类名和分类别名被占用！');
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名被占用！');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用！');

        const sql = 'insert into ev_article_cate set ?';
        // 执行插入文章分类是SQL
        db.queryHandler({ req, res, sql, params: req.body, fail: '新增文章分类失败，请稍后再试！' }).then(() => {
            res.cc('新增文章分类成功！', 0);
        });
    })
}

// 删除文章分类
const deleteCateById = (req, res) => {
    const sql = 'update ev_article_cate set is_delete=1 where id=?';
    db.queryHandler({ req, res, sql, params: req.params.id, fail: '删除文章分类失败，请稍后再试！' }).then(() => {
        res.cc('文章分类删除成功！', 0);
    });
}

// 根据id获取文章分类
const getCateById = (req, res) => {
    const sql = 'select * from ev_article_cate where id = ?';
    db.queryHandler({ req, res, sql, params: req.params.id, fail: '获取文章分类失败，请稍后再试！' }).then((results) => {
        res.send({
            status: 0,
            msg: '获取文章分类成功！',
            data: results
        });
    });
}

// 根据id更新文章分类
const updateCateById = (req, res) => {
    const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?)';
    db.queryHandler({ req, res, sql, params: [req.body.id, req.body.name, req.body.alias]}).then((results, err) => {
        if (err) return res.cc(err);
        if (results.length === 2) return res.cc('分类名和分类别名均存在！');
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名已存在！');
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名已存在！');

        const sql = 'update ev_article_cate set ? where id=?';
        db.queryHandler({ req, res, sql, params: [{ name: req.body.name, alias: req.body.alias }, req.body.id] }).then((results) => {
            res.cc('文章分类更新成功！', 0);
        });
    })
}

module.exports = {
    getArticleCates,
    addArticleCate,
    deleteCateById,
    getCateById,
    updateCateById,
}