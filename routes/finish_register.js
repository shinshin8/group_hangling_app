const express = require('express');
const router = express();
// ルートパス
const rootPath = '/';

router.get(rootPath, (req, res) => {
  const data = {
    message:'ユーザー登録が完了しました。<br> 下記のボタンからログイン画面へ遷移してサイトへログインしてください。',
  };
  const doneCreatMessage = 'finish_register';
  return res.render(doneCreatMessage, data);
});

module.exports = router;
