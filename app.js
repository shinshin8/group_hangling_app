const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');
const {outPutLog} = require('./utils/log_utils');
const passport = require('passport');
const {Strategy} = require('passport-local');
// const session = require('express-session');
const flash = require('connect-flash');
const cryptoJs = require('crypto-js');
const userModel = require('./model/user_model');
const accessModel = require('./model/access_model');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('groupingApp', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// ユーザー名入力項目
const inputUserName = 'user_name';
// パスワード入力項目
const inputPassword = 'password';
// エラーメッセージ
const loginErrorMessage = 'ユーザー名、またはパスワードが違います。';

const localStorategy = new localStorategy({
  usernameField: inputUserName,
  passwordField: inputPassword,
  passReqToCallback: true
})

passport.use(localStorategy, async(req, user_name, password, done) => {
  // パスワードのハッシュ化
  const hashingPassword = cryptoJs.SHA256(password).toString();
  // ログインユーザー取得
  const getLoginUser = await userModel.selectLoginUser(user_name, hashingPassword);
  if(!getLoginUser.length || getLoginUser.length > 1){
    return done(null, false, {
      message: loginErrorMessage
    });
  }
  // ログインユーザー
  const loginUser = getLoginUser[0];
  return done(null, loginUser);
});

// ログインユーザーのシリアライズ化
passport.serializeUser(async(user_name, password,done) => {
  // パスワードのハッシュ化
  const hashingPassword = cryptoJs.SHA256(password).toString();
  // ユーザーIDの取得
  const getLoginUserID = await userModel.selectLoginUser(user_name, hashingPassword);
  if(!getLoginUserID.length || getLoginUserID.length > 1){
    return done(null);
  }
  // ログインユーザー
  const loginUser = getLoginUserID[0];
  return done(null, loginUser);
});

// ログインユーザーのデシリアライズ化
passport.deserializeUser(async(user_name, password, done) => {
  // パスワードのハッシュ化
  const hashingPassword = cryptoJs.SHA256(password).toString();
  // ユーザーIDの取得
  const getLoginUserID = await userModel.selectLoginUser(user_name, hashingPassword);
  if(!getLoginUserID.length || getLoginUserID.length > 1){
    return done(null);
  }
  // ログインユーザー
  const loginUser = getLoginUserID[0];
  return done(null, loginUser);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
