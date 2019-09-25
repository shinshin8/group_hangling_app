const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const { dbConnection } = require('../utils/db_utils');
const groupModel = require('../model/group_list_model');
const { validationResult } = require('express-validator');
const { groupCheck } = require('../utils/validation_utils');
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
    const data = {
      errorMessage: '',
      loginUser: loginUser,
      groupName: '',
      overview: '',
    };
    const createGroup = 'create_group';
    return res.render(createGroup, data);
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

router.post(rootPath, groupCheck, async (req, res, next) => {
  try {
    // ログインユーザー取得
    const loginUser = req.user;
    // ログインユーザーが存在しない場合はログイン画面へリダイレクト
    if (!loginUser) {
      return res.redirect(redirectPath);
    }
    // ユーザーID
    const userID = loginUser.id;
    // グループ名
    const groupName = req.body.group_name;
    // 概要
    const overview = req.body.overview;
    // モーダルの登録ボタン
    const create = req.body.type;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // エラーメッセージを保持する変数
      let errorMsg = '';
      // エラーメッセージを保持する配列
      const errorArray = error.array();
      for (const err of errorArray) {
        errorMsg += `<br>${err.msg}`;
      }
      const data = {
        errorMessage: errorMsg,
        loginUser: loginUser,
        groupName: groupName,
        overview: overview,
      };
      const createGroup = 'create_group';
      return res.render(createGroup, data);
    }
    if (create === 'register') {
      // グループの新規作成
      const createNewGroup = await groupModel.createGroup(groupName, overview, userID);
      if(!createNewGroup){
        const data = {
            errorMessage: 'グループの新規登録に失敗しました。',
            loginUser: loginUser,
            groupName: groupName,
            overview: overview,
          };
          const createGroup = 'create_group';
          return res.render(createGroup, data);
      }
      const data = {
        errorMessage: '',
        loginUser: loginUser,
        groupName: groupName,
        overview: overview,
      };
      const createGroup = 'create_group';
      return res.render(createGroup, data);
    }
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;
