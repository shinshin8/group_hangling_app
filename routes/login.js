const express = require('express');
const router = express();
const { outPutLog } = require('../utils/log_utils');
const passport = require('passport');
// ルートパス
const rootPath = '/';
// ログインパス
const loginPath = '/login';
// グループ一覧パス
const newerGroupListPath = '/groupingApp/newerGroupList';
// リダイレクト先パス
const redirectPath = '/groupingApp';

router.get(rootPath, async (req, res, next) => {
  try {
    // エラーメッセージを保持する変数
    let errorMessage;
    // エラーのフラッシュメッセージを保持する配列
    const errorFlashArray = req.flash('error');
    // 認証情報不在メッセージ
    const missingCredentialMessage = 'Missing credentials';
    // フラッシュメッセージを保持する配列に格納されている最後のメッセージ
    const lastMessage = errorFlashArray[errorFlashArray.length - 1];
    if (lastMessage === missingCredentialMessage) {
      errorMessage = 'ユーザー名、またはパスワードが違います。';
    } else {
      errorMessage = lastMessage;
    }
    const data = {
      content: errorMessage,
    };
    return res.render('login', data);
  } catch (error) {
    outPutLog.error(error);
    next(error);
  }
});

// ユーザーログインポスト時のハンドリング設定
const authenticateHandle = {
  successRedirect: newerGroupListPath,
  failureRedirect: redirectPath,
  failureFlash: true,
};

router.post(loginPath, passport.authenticate('local', authenticateHandle));

module.exports = router;
