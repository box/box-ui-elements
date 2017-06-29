/* eslint-disable no-console, no-param-reassign */

'use strict';

const fs = require('fs');
const path = require('path');

const extractMessages = (dir, json) => {
    fs
    .readdirSync(dir)
    .forEach((file) => {
        const fqp = path.join(dir, file);
        const isDir = fs.statSync(fqp).isDirectory();
        if (isDir) {
            json = extractMessages(fqp, json);
        } else if (file.endsWith('.json')) {
            const arr = JSON.parse(fs.readFileSync(fqp, 'utf8'));
            arr.forEach((message) => {
                if (json[message.id]) {
                    throw new Error(`Duplicate ID ${message.id} detected!`);
                }
                json[message.id] = message;
            });
        }
    });
    return json;
};

function Json2PropsWebpackPlugin(messagesDir) {
    this.messagesDir = messagesDir;
}

Json2PropsWebpackPlugin.prototype.apply = function json2props(compiler) {
    compiler.plugin('done', () => {
        let str = '';
        const jsonDir = `${this.messagesDir}/json`;
        const messages = extractMessages(jsonDir, {});

        Object.keys(messages)
        .sort()
        .forEach((key) => {
            const message = messages[key];
            const cleanedMessage = message.defaultMessage.replace(/\s+/g, ' ');
            const cleanedDescription = message.description.trim().replace(/\s+/g, ' ');
            str = `${str}# ${cleanedDescription}\n${message.id} = ${cleanedMessage}\n`;
        });

        fs.writeFileSync(`${this.messagesDir}/en-US.properties`, str);
    });
};

module.exports = Json2PropsWebpackPlugin;
