const { config } = require ('./config');

const HOSTS = [
  {
    title: 'do1',
    host: '',
    port: '22',
    username: 'soda',
    privateKey: config.basedir + 'keys/soda.pem',
    cmd: [
      'cat /app/download_image_nft/run.sh.env',
    ]
  },
  {
    title: 'do2',
    host: '',
    port: '22',
    username: 'soda',
    privateKey: config.basedir + 'keys/soda.pem',
  },
];

const cmdAll = [
  'ls -l /app/download_image_nft/logs/',
  'ls -l /app/download_image_nft/',
];

module.exports = {
  HOSTS, cmdAll
}
