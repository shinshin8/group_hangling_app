const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const { dbConnection } = require('../utils/db_utils');
const userModel = require('../model/user_model');
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
        loginUser: loginUser,
    };
    const userProfile = 'user_profile';
    return res.render(userProfile, data);
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;