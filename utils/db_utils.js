const config = require('config');
const mysql = require('mysql2');

// DB接続情報
module.exports.dbPool = mysql.createPool(config.db_info);