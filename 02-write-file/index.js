#!/usr/bin/env node
const fs = require('fs'); 
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { encoding: 'utf-8'});
const rl = readline.createInterface({ input: process.stdin });

function exit() {
  console.log('\n Пока!');
  process.exit();
}

console.log('Привет! Введите текст');
rl.on('line', (line) => { 
  if(line === 'exit') {
    exit();
  }
  writeStream.write(line + '\n');
});
rl.on('close', exit);

process.on('SIGINT', exit);



