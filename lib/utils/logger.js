const chalk = require('chalk')
const _PLUGIN_NAME = "ExtraJsFileWebpackPlugin";
const logTool = console.log;

exports.log = (msg) => {
    logTool(chalk.bgBlackBright.white.dim(`[${_PLUGIN_NAME}] LOG  `), msg);
}

exports.info = (msg) => {
    logTool(chalk.bgBlue.black(`[${_PLUGIN_NAME}] INFO `), msg);
}
  
exports.done = (msg) => {
    logTool("\n" + chalk.bgGreenBright.black(`[${_PLUGIN_NAME}] DONE `), msg);
}  

exports.error = (msg) => {
    logTool("\n" + chalk.bgRed.white(`[${_PLUGIN_NAME}] ERROR `), msg);
}