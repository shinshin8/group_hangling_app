const log4Js = require('log4js');
const config = require('config');

// ログ出力設定
const logConfig = log4Js.configure({
  appenders: {
    system: { type: 'file', filename: 'system.log' },
  },
  categories: {
    default: { appenders: ['system'], level: 'debug' },
  },
});

module.exports.outPutLog = logConfig.getLogger();
