#!/usr/bin/env node
const fs = require('fs'); 
const path = require('path');

const pathName = path.join(__dirname, 'text.txt');
const fileStream = fs.createReadStream(pathName, 'utf-8');
fileStream.on('data', chunk => console.log(chunk));
