const fs = require('fs');
const { Client } = require('ssh2');
const { logInfo, logError } = require('../app-log');
const { HOSTS, CMD_ALL } = require('../hosts');

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
      logInfo(itemHost.title, cmds[index], data.toString());
    }).stderr.on('data', (data) => {
      logInfo(itemHost.title, 'ERROR', cmds[index], data.toString());
    });
  });
};

const runHostPutFile = (putFile) => {
  if (!putFile || putFile.length === 0) {
    return [];
  }
  const putFileExec = [];
  for (const i in putFile) {
    const item = putFile[i];
    const data = fs.readFileSync(item.local, {encoding:'utf8', flag:'r'}).replaceAll('"', '\\\"');
    putFileExec.push(`printf "${data}" > ${item.remote}`);
  }
  return putFileExec;
};

const runHostAndCmd = (itemHost, cmds) => {
  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      if (itemHost.cmd && itemHost.cmd.length > 0) {
        cmds = cmds.concat(itemHost.cmd);
      }
      cmds = cmds.concat(runHostPutFile(itemHost.putFile));
      
      runSingleCmd(conn, itemHost, cmds, 0);
    })
    .connect({
      host: itemHost.host,
      port: itemHost.port,
      username: itemHost.username,
      privateKey: fs.readFileSync(itemHost.privateKey)
    })
    .on('end', () => {
      resolve();
    })
    .on('error', (err) => {
      reject(err);
    });
  });
}

const execCmdAll = (cmdAll) => {
  var cmd = cmdAll.cmd;
  if (cmdAll.putFile && cmdAll.putFile.length > 0) {
    cmd = cmd.concat(runHostPutFile(cmdAll.putFile));
  }
  return cmd;
}

const runHostsAndCmd = async () => {
  const cmdAll = execCmdAll(CMD_ALL);
  for (const i in HOSTS) {
    await runHostAndCmd(HOSTS[i], cmdAll);
  }
}

module.exports = {
  runHostAndCmd, runHostsAndCmd
};
