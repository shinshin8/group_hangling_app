const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const config = require('config');
const validator = require('express-validator');
const { Strategy } = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const cryptoJs = require('crypto-js');
const userModel = require('./model/user_model');
const mySqlSession = require('express-mysql-session')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const newerGroupListRouter = require('./routes/group_list_newer');
const logoutRouter = require('./routes/logout');
const popularGroupListRouter = require('./routes/popular_group_list');
const userProfileRouter = require('./routes/user_profile');

const app = express();

const sessionStore = new mySqlSession(config.db_info);

// セッション設定
const sessionConfig = {
  secret: 'keybord cat',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/groupingApp', express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/groupingApp', loginRouter);
app.use('/groupingApp/newerGroupList', newerGroupListRouter);
app.use('/groupingApp/logout', logoutRouter);
app.use('/groupingApp/popularGroupList', popularGroupListRouter);
app.use('/groupingApp/profile', userProfileRouter);


// ユーザー名入力項目
const userName = 'user_name';
// パスワード入力項目
const password = 'password';
// エラーメッセージ
const loginErrorMessage = 'ユーザー名、またはパスワードが違います。';

const strategy = {
  usernameField: userName,
  passwordField: password,
  passReqToCallback: true,
};

passport.use(
  new Strategy(strategy, async (req, userName, password, done) => {
    try {
      // パスワードのハッシュ化
      const hashingPassword = cryptoJs.SHA256(password).toString();
      // ログインユーザー取得
      const getLoginUser = await userModel.selectLoginUser(
        userName,
        hashingPassword
      );
      if (!getLoginUser.length || getLoginUser.length > 1) {
        return done(null, false, {
          message: loginErrorMessage,
        });
      }
      // ログインユーザー
      const loginUser = getLoginUser[0];
      return done(null, loginUser);
    } catch (error) {
      return done(null, error);
    }
  })
);

// ログインユーザーのシリアライズ化
passport.serializeUser((loginUser, done) => {
  return done(null, loginUser);
});

// ログインユーザーのデシリアライズ化
passport.deserializeUser((loginUser, done) => {
  done(null, loginUser);
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
