const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '5244',
    database: 'my_db_01'
});

// 对 db.query()函数进行改写封装
db.queryHandler = ({req, res, sql, params, fail}) => {
    return new Promise((resolve, reject) => {
        if(params) {
            db.query(sql, params, (err, results) => {
                resHandler(err,results);
            });
        } else {
            db.query(sql, (err, results) => {
                resHandler(err,results);
            });
        }
        // 结果处理函数
        function resHandler(err, results) {
            if(
                fail &&
                (err ||
                (req.url.includes('register') && results.length > 0) ||
                (!req.url.includes('register') && results.length === 0) || 
                (!sql.includes('select') && results.affectedRows !== 1))
            ) {
                if(err) return res.cc(err);
                return res.cc(fail);
            }
            resolve(results, err);
        }
    });
}

module.exports = db;