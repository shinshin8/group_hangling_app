const { dbConnection } = require('../utils/db_utils');
const { outPutLog } = require('../utils/log_utils');

/**
 * グループ全件取得
 * @returns {Object} プロミスオブジェクト
 */
module.exports.getAllGroup = () => {
  return new Promise((resolve, reject) => {
    // 全グループ取得クエリ
    const sql = `SELECT 
                    group_list.id, 
                    group_list.group_name, 
                    group_list.group_icon, 
                    user.user_name, 
                    group_list.created_at, 
                    member.manager_flg 
                FROM(
                    member 
                  INNER JOIN 
                    group_list 
                  ON 
                    group_list.id = member.group_id
                  ) 
                INNER JOIN 
                    user 
                ON 
                    member.user_id = user.id 
                WHERE 
                    manager_flg = '1'`;
    dbConnection.query(sql, (err, result) => {
      if (err) {
        outPutLog.error(`At getAllGroup in group_list_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * 各グループのメンバー数取得
 * @returns {Object} プロミスオブジェクト
 */
module.exports.countAllGroupMember = () => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT group_id, COUNT(id) AS count_member FROM member GROUP BY group_id`;
    dbConnection.query(sql, (err, result) => {
      if (err) {
        outPutLog.error(`At countAllGroupMember in group_list_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return
    });
  });
};