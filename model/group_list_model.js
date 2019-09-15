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
                        group_list.created_at, 
                        user.user_name, 
                        user.icon_path 
                    FROM(
                            member 
                        INNER JOIN 
                            group_list 
                        ON 
                            member.group_id = group_list.id
                        ) 
                    INNER JOIN 
                        user 
                    ON 
                        member.user_id = user.id 
                    WHERE 
                        member.manager_flg = '1'`;
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
