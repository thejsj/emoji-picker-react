const { copyFileSync, ensureDirSync } = require('fs-extra');

ensureDirSync('./dist/data');
copyFileSync('./src/data/emojis.json', './dist/data/emojis.json');

console.log('Copied emojis.json to dist/data/');
