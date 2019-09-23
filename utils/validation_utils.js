const { check } = require('express-validator');

// プロフィール更新バリデーション
module.exports.profileCheck = [
  check('user_name')
    .not()
    .isEmpty()
    .withMessage('ユーザー名は必ず入力してください。'),
  check('user_name')
    .isLength({ max: 20 })
    .withMessage('ユーザー名は20文字以内で入力してください。'),
  check('mail_address')
    .not()
    .isEmpty()
    .withMessage('メールアドレスは必ず入力してください。'),
  check('mail_address')
    .isEmail()
    .withMessage('不正なメールアドレスです。'),
  check('mail_address')
    .isLength({ max: 100 })
    .withMessage('メールアドレスは100文字以内で入力してください。'),
];