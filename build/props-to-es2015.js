'use strict';

const fs = require('fs');
const path = require('path');
const propsParser = require('properties-parser');

const src = path.resolve('src/i18n');
const lib = path.resolve('lib/i18n');

fs
.readdirSync(src)
.forEach((file) => {
    const fqp = path.join(src, file);
    const target = path.join(lib, file.replace('.properties', '.js'));
    const isDir = fs.statSync(fqp).isDirectory();
    if (!isDir && file.endsWith('.properties')) {
        const messages = propsParser.read(fqp);
        const jsonString = `export default ${JSON.stringify(messages, null, 2)}`;
        fs.writeFileSync(target, jsonString);
    }
});
