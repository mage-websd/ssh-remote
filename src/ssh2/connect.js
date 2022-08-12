const { readFileSync } = require('fs');
const { Client } = require('ssh2');
const { logInfo, logError } = require('../app-log');
const { HOSTS, cmdAll } = require('../hosts');

const runSingleCmd = (conn, itemHost, cmds, index) => {
  if (!index) {
    index = 0;
  }
  if (!cmds[index]) {
    conn.end();
    return true;
  }
  conn.exec(cmds[index], (err, stream) => {
    if (err) {
      logError(err);
      conn.end();
      throw err;
    };
    stream.on('close', (code, signal) => {
      runSingleCmd(conn, itemHost, cmds, index + 1);
    }).on('data', (data) => {
      console.log(itemHost.title, cmds[index]);
      logInfo(itemHost.title, cmds[index], data.toString());
    }).stderr.on('data', (data) => {
      logInfo(itemHost.title, 'ERROR', cmds[index], data.toString());
    });
  });
};

const runHostAndCmd = (itemHost, cmds) => {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      if (itemHost.cmd && itemHost.cmd.length > 0) {
        cmds = cmds.concat(itemHost.cmd);
      }
      runSingleCmd(conn, itemHost, cmds, 0);
    })
    .connect({
      host: itemHost.host,
      port: itemHost.port,
      username: itemHost.username,
      privateKey: readFileSync(itemHost.privateKey)
    })
    .on('end', () => {
      resolve();
    })
    .on('error', (err) => {
      reject(err);
    });
  });
}

const runHostsAndCmd = async () => {
  for (const i in HOSTS) {
    await runHostAndCmd(HOSTS[i], cmdAll);
  }
}

module.exports = {
  runHostAndCmd, runHostsAndCmd
};
