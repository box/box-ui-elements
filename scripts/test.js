#!/usr/bin/env node

const crypto = require('crypto'); // eslint-disable-line
const crypto_createHash = crypto.createHash;
crypto.createHash = algorithm => {
    console.log('setting crypto in test.js:', algorithm);
    return crypto_createHash('sha256');
};
