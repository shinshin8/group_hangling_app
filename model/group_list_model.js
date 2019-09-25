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
        outPutLog.error(`At getOrganizingGroup in group_list_model.js: ${err}`);
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
  return new Promise((resolve, reject) => {
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
};

/**
 * グループの新規作成
 * @param {String} groupName グループ名
 * @param {String} overview 概要
 * @param {Number} userID ユーザーID
 * @returns {Object} プロミスオブジェクト
 */
module.exports.createGroup = (groupName, overview, userID) => {
  return new Promise((resolve, reject) => {
    // グループ登録クエリ
    const registerGroup = `INSERT INTO group_list(group_name, overview) VALUES(?, ?)`;
    //　管理者登録クエリ
    const registerMember = `INSERT INTO member(user_id, group_id, manager_flg) VALUES(?, ?, '1')`;
    dbConnection.beginTransaction(err => {
      if (err) {
        outPutLog.error(`At createGroup in group_list_model.js: ${err}`);
        reject(err);
        return;
      }
      dbConnection.query(
        registerGroup,
        [groupName, overview],
        (err, result) => {
          if (err) {
            return dbConnection.rollback(() => {
              outPutLog.error(`At createGroup in group_list_model.js: ${err}`);
              reject(err);
            });
          }
          const groupID = result.insertId;
          dbConnection.query(
            registerMember,
            [userID, groupID],
            (err, result) => {
              if (err) {
                return dbConnection.rollback(() => {
                  outPutLog.error(
                    `At createGroup in group_list_model.js: ${err}`
                  );
                  reject(err);
                });
              }
              dbConnection.commit(err => {
                if (err) {
                  return dbConnection.rollback(() => {
                    outPutLog.error(
                      `At createGroup in group_list_model.js: ${err}`
                    );
                    reject(err);
                  });
                }
                resolve(result);
              });
            }
          );
        }
      );
    });
  });
};
