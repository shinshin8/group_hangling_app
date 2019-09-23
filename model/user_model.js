const { dbConnection } = require('../utils/db_utils');
const { outPutLog } = require('../utils/log_utils');

/**
 * ログインユーザー取得処理
 * @param {String} userName ユーザー名
 * @param {String} hashedPassword ハッシュ化されたパスワード
 * @returns {Object} プロミスオブジェクト
 */
module.exports.selectLoginUser = (userName, hashedPassword) => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT 
                      id,
                      user_name,
                      password,
                      mail_address,
                      icon_path,
                      autority_flg
                  FROM 
                      user 
                  WHERE 
                      user_name = ?
                  AND
                      password = ?`;
    dbConnection.query(sql, [userName, hashedPassword], (err, result) => {
      if (err) {
        outPutLog.error(`At selectLoginUser in user_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * 権限フラグ取得
 * @param {String} userName ユーザー名
 * @param {String} password パスワード
 * @returns {Object} プロミスオブジェクト
 */
module.exports.getAuthorityFlg = authorityFlg => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT authority_flg FROM user WHERE user_name = ? AND `;
    dbConnection.query(sql, [authorityFlg], (err, result) => {
      if (err) {
        outPutLog.error(`At getAuthorityFlg in user_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * ユーザー名とパスワードのペアがユニークであるかを判定
 * @param {String} userName ユーザー名
 * @param {String} password パスワード
 * @returns プロミスオブジェクト
 */
module.exports.isUniqueUser = (userName, password) => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT id FROM user WHERE user_name = ? AND password = ?`;
    dbConnection.query(sql, [userName, password], (err, result) => {
      if (err) {
        outPutLog.error(`At isUniqueUser in user_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * ユーザー情報の更新
 * @param {String} userName ユーザー名
 * @param {String} mailAddress メールアドレス
 * @param {Number} userID ユーザーID
 * @returns プロミスオブジェクト
 */
module.exports.updateUser = (userName, mailAddress, userID) => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `UPDATE user SET user_name = ?, mail_address = ? WHERE id = ?`;
    dbConnection.query(sql, [userName, mailAddress, userID], (err, result) => {
      if (err) {
        outPutLog.error(`At updateUser in user_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};
