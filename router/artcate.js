const {
    getArticleCates, 
    addArticleCate,
    deleteCateById,
    getCateById,
    updateCateById,
} = require('../router_handler/artcate');

const {
    add_cate_schema,
    delete_cate_schema,
    get_cate_schema,
    update_cate_schema,
} = require('../schema/artcate');

module.exports = {
    "/my/article/cates": { type: 'get', fn: getArticleCates},
    "/my/article/addcates": { type: 'post', fn: addArticleCate, schema: add_cate_schema},
    "/my/article/deletecates/:id": { type: 'get', fn: deleteCateById, schema: delete_cate_schema},
    "/my/article/getcates/:id": { type: 'get', fn: getCateById, schema: get_cate_schema},
    "/my/article/updatecates": { type: 'post', fn: updateCateById, schema: update_cate_schema},
}