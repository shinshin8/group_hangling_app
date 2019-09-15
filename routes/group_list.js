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
    console.log(loginUser);
    // ログインユーザーが存在しない場合はログイン画面へリダイレクト
    if (loginUser) {
      return res.redirect(redirectPath);
    }
    // グループ取得
    const getAllGroups = await groupListModel.getAllGroup();
    const data = {
      loginUser: loginUser,
      groups: getAllGroups,
    };
    const groupList = 'group_list';
    return res.render(groupList, data);
  } catch (error) {
    outPutLog.error(err);
    // dbConnection.end();
    next(error);
  }
});

module.exports = router;