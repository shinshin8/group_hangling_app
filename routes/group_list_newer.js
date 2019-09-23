const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const { dbConnection } = require('../utils/db_utils');
const groupListModel = require('../model/group_list_model');
// ルートパス
const rootPath = '/';
// リダイレクト先パス
const redirectPath = '/groupingApp';

router.get(rootPath, async (req, res, next) => {
  try {
    // ログインユーザー取得
    const loginUser = req.user;
    // ログインユーザーが存在しない場合はログイン画面へリダイレクト
    if (!loginUser) {
      return res.redirect(redirectPath);
    }
    // グループ取得
    const getAllGroups = await groupListModel.getAllGroup();
    // 各グループのメンバー数取得
    const getGroupNumber = await groupListModel.countAllGroupMember();
    // 新着順のグループ情報を保持する配列
    let newerGroupList = [];
    if (getAllGroups.length > 0 && getGroupNumber.length > 0) {
      // 各グループとメンバー数の結合情報を保持する配列
      const allGroupInfo = [];
      for (const group of getAllGroups) {
        for (member of getGroupNumber) {
          if (group.id === member.group_id) {
            let obj = {};
            obj.id = group.id;
            obj.group_name = group.group_name;
            obj.icon = group.icon_path;
            obj.user_name = group.user_name;
            obj.created_at = group.created_at;
            obj.count_number = member.count_member;
            allGroupInfo.push(obj);
          }
        }
      }
      // グループを新着順に並び替える。
      newerGroupList = allGroupInfo.sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1
      );
    }
    console.log(loginUser);
    const data = {
      loginUser: loginUser,
      groups: newerGroupList,
    };
    const groupListNewer = 'group_list_newer';
    return res.render(groupListNewer, data);
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;
