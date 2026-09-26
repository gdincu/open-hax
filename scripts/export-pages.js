// Builds a static `dist/` folder suitable for GitHub Pages.
// - Copies public assets (css/js/img/sounds/favicon + built bundle)
// - Renders views/layout.hbs + views/index.hbs to dist/index.html with
//   relative ("./") asset paths so both user pages (/) and project
//   pages (/<repo>/) work.
// Run: npm run build && node scripts/export-pages.js
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var publicDir = path.join(root, 'public');
var distDir = path.join(root, 'dist');

function rimraf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(function (entry) {
    var p = path.join(dir, entry);
    if (fs.statSync(p).isDirectory()) {
      rimraf(p);
    } else {
      fs.unlinkSync(p);
    }
  });
  fs.rmdirSync(dir);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  var stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function (entry) {
      // Skip empty uploads dir and unbuilt bundle placeholder noise
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    });
  } else {
    if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// Clean + recreate dist
rimraf(distDir);
fs.mkdirSync(distDir, { recursive: true });

// Copy static assets (bundle must already exist via `npm run build`)
['css', 'js', 'img', 'sounds', 'bundle'].forEach(function (sub) {
  copyRecursive(path.join(publicDir, sub), path.join(distDir, sub));
});
['favicon.png', 'phaser.png'].forEach(function (file) {
  var src = path.join(publicDir, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(distDir, file));
});

// Static index.html — mirrors views/layout.hbs + views/index.hbs.
// Keep in sync with views/layout.hbs (which also uses ./ paths so that
// local Express dev at / and Pages at /<repo>/ both work).
var html = '<!DOCTYPE html>\n' +
'<html>\n' +
'\t<head>\n' +
'\t\t<meta charset="utf-8">\n' +
' \t\t<meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
' \t \t<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
' \t \t<title>Open Hax</title>\n' +
'\t\t<link rel="stylesheet" type="text/css" href="./css/normalize.css">\n' +
'\t\t<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">\n' +
'\t\t<link rel="shortcut icon" href="./favicon.png" />\n' +
'\t\t<script src="./js/phaser.js"></script>\n' +
'\t</head>\n' +
'\t<body class="sans">\n' +
'\t\t<div id="app-mount-point"></div>\n' +
'\n' +
'\t\t<script src="./bundle/common.js"></script>\n' +
'\t\t<script src="./bundle/app.js"></script>\n' +
'\t</body>\n' +
'</html>\n';

fs.writeFileSync(path.join(distDir, 'index.html'), html);

// Prevent Jekyll processing on Pages (we have no _-prefixed files, but harmless)
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('GitHub Pages export written to dist/');
