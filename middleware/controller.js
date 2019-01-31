const fs = require('fs');
const PATH = require('path');

function addMapping(router, mapping) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`  [Register URL] GET ${path}`);
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`  [Register URL] POST ${path}`);
    } else {
      console.log(`  [Register URL] INVALID ${url}`);
    }
  }
}

function addControllers(router) {
  let files = fs.readdirSync(PATH.resolve(__dirname, '../controllers'));
  let js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (var f of js_files) {
    console.log(`[Import Controller] ${f}`);
    let mapping = require(PATH.resolve(__dirname, '../controllers/' + f));
    addMapping(router, mapping);
  }
}

module.exports = function (dir) {
  let
    controllers_dir = dir || 'controllers', // default controller dir
    router = require('koa-router')();
  addControllers(router, controllers_dir);
  return router.routes();
};