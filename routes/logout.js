const express = require('express');
const router = express();
// ルートパス
const rootPath = '/';
// ログイン画面
const initPath = '/groupingApp';

router.get(rootPath, (req, res) => {
  req.logout();
  res.redirect(initPath);
});

module.exports = router;
