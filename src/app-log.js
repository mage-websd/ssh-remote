const fs = require('fs');
const util = require('util');
const moment = require('moment');
const { config } = require('./config');

const logStdout = process.stdout;

function logConsole(d) {
  logStdout.write(util.format(d) + '\n');
}

function logFile(d, file) {
  var logText = '';
  for (const i in d) {
    logText += util.format(d[i]) + ' -- ';
  }
  fs.appendFileSync(file, moment().format('YYYY-MM-DD HH:mm:ss') + ': ' + logText.slice(0, -4) + '\n');
}

function openFile(fileName) {
  return `${config.basedir}logs/${moment().format('YYYYMMDD')}_${fileName}.log`;
}

function logInfo(...d) {
  logFile(d, openFile('info'));
}

function logError(...d) {
  logFile(d, openFile('error'));
}

function logInfoConsole(...d) {
  logFile(d, openFile('info'));
  logConsole(d);
}

function logErrorConsole(...d) {
  logFile(d, openFile('error'));
  logConsole(d);
}

function logFileName(fileName, ...d) {
  logFile(d, openFile(fileName));
}

module.exports = {
  logInfo, logError, logInfoConsole, logErrorConsole, logFileName
}
