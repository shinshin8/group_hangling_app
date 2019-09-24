const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const { dbConnection } = require('../utils/db_utils');
const groupListModel = require('../model/group_list_model');
// ルートパス
const rootPath = '/';

router.get(rootPath, async (req, res, next) => {
  try {
    // ログインユーザー取得
    const loginUser = req.user;
    // ログインユーザーが存在しない場合はログイン画面へリダイレクト
    if (!loginUser) {
      return res.redirect(redirectPath);
    }
    // ログインユーザーID
    const userID = loginUser.id;
    // ログインユーザーがメンバーとなっているグループを取得
    const memberGroup = await groupListModel.getMemberGroup(userID);
    // ログインユーザーがメンバーとなっているグループのメンバー数を取得
    const countMember = await groupListModel.getMemberGroupMember(userID);
    // 所属グループ情報を保持する配列
    let belongGroup = [];
    // グループが存在しない場合のメッセージを保持する変数
    let message = '所属しているグループが存在しません。';
    if (memberGroup.length > 0 && countMember.length > 0) {
      message = '';
      // 各グループとメンバー数の結合情報を保持する配列
      const allGroupInfo = [];
      for (const group of memberGroup) {
        for (member of countMember) {
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
      belongGroup = allGroupInfo.sort((a, b) =>
        a.created_at < b.created_at ? 1 : -1
      );
    }
    const data = {
      loginUser: loginUser,
      message: message,
      groups: belongGroup,
    };
    const groupManaging = 'group_managing';
    return res.render(groupManaging, data);
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;
