const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const { dbConnection } = require('../utils/db_utils');
const userModel = require('../model/user_model');
const { validationResult } = require('express-validator');
const { createNewUserCheck } = require('../utils/validation_utils');
const cryptoJs = require('crypto-js');
// ルートパス
const rootPath = '/';

router.get(rootPath, (req, res) => {
  const data = {
    errorMessage: '',
    userName: '',
    mailAddress: '',
    password: '',
    confirmPassword: '',
  };
  const createUser = 'create_new_user';
  return res.render(createUser, data);
});

router.post(rootPath, createNewUserCheck, async (req, res, next) => {
  try {
    // ユーザー名
    const userName = req.body.user_name;
    // メールアドレス
    const mailAddress = req.body.mail_address;
    // パスワード
    const password = req.body.password;
    // 確認用パスワード
    const confirmPassword = req.body.confirm_password;
    // モーダルの更新ボタン
    const registerUser = req.body.type;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // エラーメッセージを保持する変数
      let errorMsg = '';
      // エラーメッセージを保持する配列
      const errorArray = error.array();
      for (const err of errorArray) {
        errorMsg += `<br>${err.msg}`;
      }
      if (password !== confirmPassword) {
        errorMsg += `<br>入力されたパスワードが一致しません。`;
      }
      const data = {
        errorMessage: errorMsg,
        userName: userName,
        mailAddress: mailAddress,
        password: password,
        confirmPassword: confirmPassword,
      };
      const createUser = 'create_new_user';
      return res.render(createUser, data);
    }
    if (registerUser === 'register') {
      // パスワードのハッシュ化
      const hashingPassword = cryptoJs.SHA256(password).toString();
      // 既に存在するユーザーかの判定処理
      const isExistUser = await userModel.isExistUser(userName, hashingPassword);
      if(isExistUser.length > 1){
        const data = {
          errorMessage: '既に存在するユーザーです。<br> 別のユーザー名またはパスワードを入力してください。',
          userName: userName,
          mailAddress: mailAddress,
          password: password,
          confirmPassword: confirmPassword,
        };
        const createUser = 'create_new_user';
        return res.render(createUser, data);
      }
      // ユーザー登録
      const registerUser = await userModel.registerUser(
        userName,
        hashingPassword,
        mailAddress
      );
      if (!registerUser) {
        const data = {
          errorMessage: 'ユーザーの登録に失敗しました。',
          userName: userName,
          mailAddress: mailAddress,
          password: password,
          confirmPassword: confirmPassword,
        };
        const createUser = 'create_new_user';
        return res.render(createUser, data);
      }
      const doneCreatMessage = '/groupingApp/finishCreate';
      return res.redirect(doneCreatMessage)
      
    }
  } catch (error) {
    outPutLog.error(error);
    dbConnection.end();
    next(error);
  }
});

module.exports = router;
