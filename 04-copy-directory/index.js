const fs = require('fs');
const path = require('path');

const copy = async() => {
  const pathDir = path.join(__dirname, 'files-copy');
  await fs.promises.rm(pathDir, {force: true, recursive: true});
  await fs.promises.mkdir(pathDir);
  const files = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
  for (const file of files) {
    const filePath = path.join(__dirname, 'files', file.name);
    const copyPath = path.join(__dirname, 'files-copy', file.name);
    await fs.promises.copyFile(filePath, copyPath);
  }
};
copy();
