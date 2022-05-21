     
const path = require('path');
const fs = require('fs/promises');

async function read() {
  try {
    const files = await fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    for(const file of files) {
      if(file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const extension = path.extname(file.name).split('.');
        const size = await fs.stat(filePath).then((stat) => stat.size);
        const name = file.name.split('.');
        console.log(`${name[0]} - ${extension[1]} - ${size} byte `);
      }
    }
  } catch(err) {
    console.error(err);
  }
}

read();
