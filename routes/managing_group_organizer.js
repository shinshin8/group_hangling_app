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
    // ログインユーザーID
    const userID = loginUser.id;
    // 管理者になっているグループを取得
    const getOrganizingGroup = await groupListModel.getOrganizingGroup(userID);
    // 管理者になっているグループのメンバー数を取得
    const getOrganizingGroupMemberCount = await groupListModel.getOrganizingGroupMember(
      userID
    );
    // 管理グループ情報を保持する配列
    let organizingGroup = [];
    // グループが存在しない場合のメッセージを保持する変数
    let message = '管理しているグループが存在しません。';
    if (
      getOrganizingGroup.length > 0 &&
      getOrganizingGroupMemberCount.length > 0
    )
      message = '';
    // 各グループとメンバー数の結合情報を保持する配列
    const allGroupInfo = [];
    for (const group of getOrganizingGroup) {
      for (member of getOrganizingGroupMemberCount) {
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
    organizingGroup = allGroupInfo.sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1
    );
    const data = {
      loginUser: loginUser,
      message: message,
      groups: organizingGroup,
    };
    const managingOrganizeGroup = 'group_managing_organize';
    return res.render(managingOrganizeGroup, data);
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;
