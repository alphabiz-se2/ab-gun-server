import express from 'express'
import Gun from 'gun'
import path from "path";

const port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765);
const public_path = path.join(path.resolve('.'), 'public')
const store_directory = 'data'
console.log('public_path', public_path)
const app = express();
// app.use(Gun.serve);
app.use(express.static(public_path));
const server = app.listen(port);

// const gun = Gun({
//   file: store_directory,
//   web: server
// });
// global.Gun = Gun; /// make global to `node --inspect` - debug only
// global.gun = gun; /// make global to `node --inspect` - debug only
// console.log('Server started on port ' + port + ' with /gun');

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
