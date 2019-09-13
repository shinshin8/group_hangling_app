const log4Js = require('log4js');
const config = require('config');

// ログ出力設定
const logConfig = log4Js.configure({
    appenders: {
        output_log:{
            type: config.output_log.type,
            filename: config.output_log.filename
        }
    },
    categories:{
        default:{
            appenders:[config.log_file],
            level: config.categories
        }
    }
})

module.exports.outPutLog = logConfig.getLogger();