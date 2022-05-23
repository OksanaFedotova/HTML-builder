#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectPath =  path.join(__dirname, 'project-dist');

const bundleHtml = async () => {
  const initialHtmlPath = path.join(__dirname, 'template.html');
  const bundleHtmlPath = path.join(projectPath, 'index.html');

  const readStream = fs.createReadStream(initialHtmlPath, 'utf-8');
  const writeStream = fs.createWriteStream(bundleHtmlPath);

  readStream.on('data', async (template) => {
    //Прочтение и сохранение в переменной файла-шаблона
    let templateHTML = template.toString();
    let bundleHtml = templateHTML;
    //Нахождение всех имён тегов в файле шаблона
    const reg = /{{.+}}/gi;
    const templateTags = templateHTML.match(reg);
    //Замена шаблонных тегов содержимым файлов-компонентов
    for (const templateTag of templateTags) {
      const componentName = templateTag.match(/\w+/)[0];
      const componentPath = path.join(__dirname, 'components', `${componentName}.html`);
      await fs.promises.readFile(componentPath, 'utf-8').then((component) => {
        bundleHtml = bundleHtml.replace(templateTag, component);
      });
    }
    //Запись изменённого шаблона в файл **index.html** в папке **project-dist**
    writeStream.write(bundleHtml);
  });
}; 

const bundleCSS = async() => {
  const initialCcsPath = path.join(__dirname, 'styles');
  const bundleCssPath = path.join(__dirname, 'project-dist', 'style.css');

  const writeStream = fs.createWriteStream(bundleCssPath, { encoding: 'utf-8'});

  const files = await fs.promises.readdir(initialCcsPath, {withFileTypes: true});

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
  
const bundleAssets = async (initialPath, bundlePath) => {

  await fs.promises.rm(initialPath, { force: true, recursive: true});
  await fs.promises.mkdir(bundlePath);

  const nodes = await fs.promises.readdir(initialPath, {withFileTypes: true});

  for(const node of nodes) {
    if(node.isFile()) {
      const initialFilePath = path.join(initialPath, node.name);
      const copyFilePath = path.join(bundlePath, node.name);
      fs.promises.copyFile(initialFilePath, copyFilePath);
    } else {
      bundleAssets(path.join(initialPath, node.name), path.join(bundlePath, node.name));
    }
  }

};

const build = async() => {

  await fs.promises.rm(projectPath, { force: true, recursive: true});
  await fs.promises.mkdir(projectPath);

  bundleHtml();
  bundleCSS();
  
  const initialAssetsPath = path.join(__dirname, 'assets');
  const bundleAssetsPath = path.join(__dirname, 'project-dist', 'assets');
  bundleAssets(initialAssetsPath, bundleAssetsPath);
};

build();