import express from 'express'
import path from "path";
import Gun from 'gun'
import fs from "fs";
// import 'gun/lib/yson';
// import 'gun/sea';
// import 'gun/lib/axe';
// import 'gun/lib/webrtc';

console.log('=============================================================================')
console.log('============================== start ========================================')
console.log('=============================================================================')

const port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765);
const public_path = path.join(path.resolve('.'), 'public')

console.log('- date:', new Date().toISOString())
console.log('- port:', port)
console.log('- AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET)
console.log('- AWS_S3_ACCESS_KEY_ID:', process.env.AWS_S3_ACCESS_KEY_ID)
console.log('- AWS_S3_SECRET_ACCESS_KEY:', process.env.AWS_S3_SECRET_ACCESS_KEY)

const app = express();
// app.use(Gun.serve);
app.use(express.static(public_path));

app.get('/cmd/foo', async (req, res) => {
  const { pathname } = req.query
  console.log('==========================', '[/cmd/foo]', 'pathname', pathname, '==========================')
  const files = []
  await walkDir(path.resolve(pathname || '.'), ({filename}) => {
    // if (['/node_modules/', '/.git/', '/.idea/'].some(x => filename.startsWith(x))) return
    files.push(filename)
  })

  res.status(200).json({
    root: path.resolve('.'),
    files
  })

  async function walkDir(root, callback, dir = null) {
    const files = await fs.promises.readdir(path.join(...[root, dir].filter(x => !!x)))
    console.log('walkDir:files', files)
    for (const file of files) {
      const pathname = path.join(...[dir, file].filter(x => !!x))
      const filename = path.join(root, pathname)
      console.log('walkDir:filename', filename)
      const stat = await fs.promises.stat(filename)
      if (stat.isDirectory()) {
        await walkDir(root, callback, pathname)
      } else {
        await callback({
          filename,
        })
      }
    }
  }
})

const server = app.listen(port);

// const gun = Gun({
//   web: server,
//   // rfs: false,
//   // localStorage: false,
//   // radisk: false,
//   max: 1e7,
//   // peers: [
//   //   'https://gun-manhattan.herokuapp.com/gun',
//   // ],
//   // file: '',
//
//   // ...((!['AWS_S3_ACCESS_KEY_ID', 'AWS_S3_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET'].some(x => !process.env[x])) ? {
//   //   s3: {
//   //     key: process.env.AWS_S3_ACCESS_KEY_ID, // AWS Access Key
//   //     secret: process.env.AWS_S3_SECRET_ACCESS_KEY, // AWS Secret Token
//   //     bucket: process.env.AWS_S3_BUCKET // The bucket you want to save into
//   //   }
//   // } : {}),
// });
// global.Gun = Gun; /// make global to `node --inspect` - debug only
// global.gun = gun; /// make global to `node --inspect` - debug only
console.log('Server started on port ' + port + ' with /gun');

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
