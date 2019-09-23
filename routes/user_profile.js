const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const { dbConnection } = require('../utils/db_utils');
const userModel = require('../model/user_model');
const { validationResult } = require('express-validator');
const { profileCheck } = require('../utils/validation_utils');
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
      userName: loginUser.user_name,
      mailAddress: loginUser.mail_address,
    };
    const userProfile = 'user_profile';
    return res.render(userProfile, data);
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

router.post(rootPath, profileCheck, async (req, res, next) => {
  try {
    // ログインユーザー取得
    const loginUser = req.user;
    // ログインユーザーが存在しない場合はログイン画面へリダイレクト
    if (!loginUser) {
      return res.redirect(redirectPath);
    }
    // ユーザーID
    const userID = loginUser.id;
    // ユーザー名
    const userName = req.body.user_name;
    // メールアドレス
    const mailAddress = req.body.mail_address;
    // モーダルの更新ボタン
    const updateProfile = req.body.type;
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
        userName: userName,
        mailAddress: mailAddress,
      };
      const userProfile = 'user_profile';
      return res.render(userProfile, data);
    }
    if (updateProfile == 'update') {
      // パスワード
      const password = loginUser.password;
      // DBを検索し、ユーザー名とパスワードのペアがユニークであるかを判定する。
      const isUniqueUser = await userModel.isUniqueUser(userName, password);
      if (isUniqueUser >= 1) {
        // エラーメッセージ
        const errorMessage =
          'すでに存在しているユーザー名です。<br>他のユーザー名を設定してください。';
        const data = {
          errorMessage: errorMessage,
          loginUser: loginUser,
          userName: userName,
          mailAddress: mailAddress,
        };
        const userProfile = 'user_profile';
        return res.render(userProfile, data);
      }
      // ユーザー情報の更新
      await userModel.updateUser(userName, mailAddress, userID);
      const data = {
        errorMessage: '',
        loginUser: loginUser,
        userName: userName,
        mailAddress: mailAddress,
      };
      const userProfile = 'user_profile';
      return res.render(userProfile, data)
    }
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;
