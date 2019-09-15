const config = require('config');
const mysql = require('mysql2');

// DB接続情報
module.exports.dbConnection = mysql.createConnection(config.db_info);
