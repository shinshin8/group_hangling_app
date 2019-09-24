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
                    user.user_name, 
                    user.icon_path,
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
                    member.user_id = user.id`;
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
        outPutLog.error(
          `At countAllGroupMember in group_list_model.js: ${err}`
        );
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * 所属グループリスト取得
 * @param {Nubmer} userID ユーザーID
 * @returns {Object} プロミスオブジェクト
 */
module.exports.getMemberGroup = userID => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT 
                    group_list.id, 
                    group_list.group_name, 
                    user.user_name, 
                    user.icon_path,
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
                WHERE member.manager_flg = "0" AND member.user_id = ?`;
    dbConnection.query(sql, [userID], (err, result) => {
      if (err) {
        outPutLog.error(`At getMemberGroup in group_list_model.js: ${err}`);
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * 所属グループのメンバー数の取得
 * @param {Number} userID ユーザーNo
 * @returns {Object} プロミスオブジェクト
 */
module.exports.getMemberGroupMember = userID => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT group_id, COUNT(id) AS count_member FROM member WHERE user_id = ? GROUP BY group_id`;
    dbConnection.query(sql, [userID], (err, result) => {
      if (err) {
        outPutLog.error(
          `At getMemberGroupMember in group_list_model.js: ${err}`
        );
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * 管理者になっているグループを取得する
 * @param {Number} userID ユーザーID
 * @returns {Object} プロミスオブジェクト
 */
module.exports.getOrganizingGroup = userID => {
  return new Promise((resolve, reject) => {
    // 実行クエリ
    const sql = `SELECT 
                    group_list.id, 
                    group_list.group_name, 
                    user.user_name, 
                    user.icon_path,
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
                WHERE member.manager_flg = "1" AND member.user_id = ?`;
    dbConnection.query(sql, [userID], (err, result) => {
      if (err) {
        outPutLog.error(
          `At getOrganizingGroup in group_list_model.js: ${err}`
        );
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
};

/**
 * 管理者になっているグループのメンバー数取得
 * @param {Number} userID ユーザーID
 * @returns {Object} プロミスオブジェクト
 */
module.exports.getOrganizingGroupMember = userID => {
  return new Promise((resolve, reject)=>{
    // 実行クエリ
    const sql = `SELECT group_id, COUNT(id) AS count_member FROM member WHERE user_id = ? GROUP BY group_id`;
    dbConnection.query(sql, [userID], (err, result) => {
      if (err) {
        outPutLog.error(
          `At getOrganizingGroupMember in group_list_model.js: ${err}`
        );
        reject(err);
        return;
      }
      resolve(result);
      return;
    });
  });
}