import fs from 'fs';
import test from 'ava';
import path from 'path';
import webpack from 'webpack';
import delay from 'delay';
import options from './webpack.config.js';
import rimraf from 'rimraf';
import glob from 'glob';
import FileManagerPlugin from './lib';

test.before(async () => {
  console.log("running webpack build..");
  webpack(options, function(err, stats) {
    if (err) return done(err);
    if (stats.hasErrors()) return done(new Error(stats.toString()));
  });
  await delay(3000);
});

test.serial('should successfully copy when { source: "/source/*", destination: "/dest" } provided', t => {

  const result = fs.existsSync("./testing/testing1");
  t.true(result);
  t.pass();

});

test.serial('should successfully copy when { source: "/source/**/*", destination: "/dest" } provided', t => {

  const result = fs.existsSync("./testing/testing2");
  t.true(result);
  t.pass();

});

test.serial('should successfully copy and create destination directory { source: "/source", destination: "/dest/doesnt-exist-yet" } provided', t => {

  const result = fs.existsSync("./testing/testing3");
  t.true(result);
  t.pass();

});

test.serial('should successfully copy and create destination directory when { source: "/source/{file1,file2}.js", destination: "/dest/doesnt-exist-yet" } provided', t => {

  const result = fs.existsSync("./testing/testing4/bundle.js");
  t.true(result);
  t.pass();

});

test.serial('should successfully copy and create destination directory when { source: "/source/**/*.{html,js}", destination: "/dest/doesnt-exist-yet" } provided', t => {

  const result = fs.existsSync("./testing/testing5/bundle.js");
  t.true(result);
  t.pass();

});

test.serial('should successfully copy when { source: "/sourceFile.js", destination: "/destFile.js" } provided', t => {

  const result = fs.existsSync("./testing/newfile.js");
  t.true(result);
  t.pass();

});

test.serial('should successfully first create destination if it does not exist and copy inside destination when { source: "/sourceFile.js", destination: "/destFolder" } provided', t => {

  const result = fs.existsSync("./testing/testing6/bundle.js");
  t.true(result);
  t.pass();

});

test.serial('should successfully copy a [hash] file name to destination when { source: "/sourceFile-[hash].js", destination: "/destFolder" } provided', t => {

  const result = fs.existsSync("./testing/hashed-bundle.js");
  t.true(result);
  t.pass();

});


test.serial('should successfully copy a file to hashed destination when { source: "/sourceFile.js", destination: "[hash]-destFile.js" } provided', t => {

  const result = glob.sync("./testing/**/*-hashbundlecheck.js");
  t.true(result.length > 0 ? true : false);
  t.pass();

});

test.serial('should successfully archive (ZIP) a directory to destination ZIP when { source: "/source", destination: "/dest.zip" } provided', t => {

  const result = fs.existsSync("./testing/test1.zip");
  t.true(result);
  t.pass();

});

test.serial('should successfully archive (ZIP) a single file to destination ZIP when { source: "/sourceFile.js", destination: "/dest.zip" } provided', t => {

  const result = fs.existsSync("./testing/test2.zip");
  t.true(result);
  t.pass();

});


test.serial('should successfully archive (ZIP) a directory glob to destination ZIP when { source: "/source/**/*", destination: "/dest.zip" } provided', t => {

  const result = fs.existsSync("./testing/test3.zip");
  t.true(result);
  t.pass();

});


test.serial('should successfully archive (TAR) a directory glob to destination TAR when { source: "/source/**/*", destination: "/dest.zip", format: "tar" } provided', t => {

  const result = fs.existsSync("./testing/test4.tar");
  t.true(result);
  t.pass();

});

test.serial('should successfully archive (TAR.GZ) a directory glob to destination TAR.GZ when { source: "/source/**/*", destination: "/dest.tar.gz", format: "tar" } provided', t => {

  const result = fs.existsSync("./testing/test5.tar.gz");
  t.true(result);
  t.pass();

});

test.serial('should fail webpack build when string provided in delete function instead of array', async t => {

  const baseConfig = getBasePlainConfig();
  const configWithStringInDelete = Object.assign(baseConfig, {
    plugins: [
      new FileManagerPlugin({
        onStart: {
          delete: "string instead of array",
        }
      })
    ]
  });

  webpack(configWithStringInDelete, function (err, stats) {
    if (err || stats.hasErrors()) t.pass();
    else t.fail();
  });

  await delay(1000);

});

function getBasePlainConfig() {

  return {
    entry: path.resolve(__dirname, 'example/index.js'),
    stats: "verbose",
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        { test: /\.css$/, loader: 'style!css' }
      ]
    }
  };

}
