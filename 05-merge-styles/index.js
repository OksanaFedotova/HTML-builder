#!/usr/bin/env node
const fs = require('fs'); 
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(bundlePath, { encoding: 'utf-8'});

const merge = async() => {
  const stylePath = path.join(__dirname, 'styles');
  const files = await fs.promises.readdir(stylePath, {withFileTypes: true});
  for (const file of files) {
    if(file.isFile()) {
      const extension = path.extname(file.name); 
      if (extension === '.css') {
        const fileStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
        fileStream.on('data', chunk => writeStream.write(chunk));
      }
    }
  }
};

merge();
