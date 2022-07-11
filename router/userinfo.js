const {
    getUserInfo, 
    updateUserInfo, 
    updatePassword,
    updateAvatar
} = require('../router_handler/userinfo');
const {
    update_userinfo_schema, 
    update_password_schema,
    update_avatar_schema
} = require('../schema/userinfo');

module.exports = {
    '/my/userinfo': {type: 'get', fn: getUserInfo},
    '/my/userinfo': {type: 'post', fn: updateUserInfo, schema: update_userinfo_schema},
    '/my/update/password': {type: 'post', fn: updatePassword, schema: update_password_schema},
    '/my/update/avatar': {type: 'post', fn: updateAvatar, schema: update_avatar_schema},
}