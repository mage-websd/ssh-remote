const { config } = require ('./config');

const HOSTS = [
  {
    title: 'do1',
    host: 'x.x.x.x',
    port: '22',
    username: 'soda',
    privateKey: config.basedir + 'keys/soda.pem',
    // cmd: [
    //   'cat /app/download_image_nft/run.sh.env',
    // ],
    // putFile: [
    //   {
    //     local: `${config.basedir}keys/a.txt`,
    //     remote: '/app/a.txt'
    //   }
      
    // ]
  },
  
];

const CMD_ALL = {
  cmd: [
    'ls -l /app/download_image_nft/logs/',
    // 'wc -l /app/download_image_nft/logs/20220811_donwload.log',
    // 'bash /app/download_image_nft/gitrun.sh.env',
    // 'bash /app/download_image_nft/notgitrun.sh.env'
  ],
  // putFile: [
  //   {
  //     local: `${config.basedir}keys/b.txt`,
  //     remote: '/app/b.txt'
  //   }
  // ]
};

module.exports = {
  HOSTS, CMD_ALL
}
