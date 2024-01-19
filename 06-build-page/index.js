const fs = require('fs/promises');
const path = require('path');

const distPath = path.resolve(__dirname, 'project-dist');
const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const assetsPath = path.resolve(__dirname, 'assets');
const templatePath = path.resolve(__dirname, 'template.html');

const htmlBundler = async (distPath, componentsPath, templatePath) => {
  const extension = '.html';
  const bundleName = 'index.html';

  try {
    const files = await fs.readdir(componentsPath);
    const htmlFiles = files.filter((file) => path.extname(file) === extension);

    const fileContents = await Promise.all(
      htmlFiles.map(async (file) => {
        const componentName = path.basename(file, extension);
        const filePath = path.resolve(componentsPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return { name: componentName, content: fileContent };
      }),
    );

    const template = await fs.readFile(templatePath, 'utf-8');
    const pattern = /\{\{([^{}]+)\}\}/g;

    const html = template.replace(pattern, (match, p1) => {
      const file = fileContents.find((file) => file.name === p1);
      return file ? file.content : '';
    });

    await fs.mkdir(distPath, { recursive: true });
    await fs.writeFile(path.resolve(distPath, bundleName), html);
  } catch (err) {
    console.log(err);
  }
};

const cssBundler = async (distPath, stylesPath) => {
  const extension = '.css';
  const bundleName = 'style.css';

  try {
    const files = await fs.readdir(stylesPath);
    const cssFiles = files.filter((file) => path.extname(file) === extension);

    const cssContents = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.resolve(stylesPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      }),
    );

    const css = cssContents.join('\n');

    await fs.mkdir(distPath, { recursive: true });
    await fs.writeFile(path.resolve(distPath, bundleName), css);
  } catch (err) {
    console.log(err);
  }
};

const copyDir = async (src, dest) => {
  try {
    await fs.mkdir(dest, { recursive: true });

    const files = await fs.readdir(src, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.resolve(src, file.name);
        const destPath = path.resolve(dest, file.name);

        if (file.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }),
    );
  } catch (err) {
    console.log(err);
  }
};

const assetsBundler = async (distPath, assetsPath) => {
  try {
    const files = await fs.readdir(assetsPath);

    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.resolve(assetsPath, file);
        const destPath = path.resolve(distPath + '/assets', file);

        await copyDir(srcPath, destPath);
      }),
    );
  } catch (err) {
    console.log(err);
  }
};

htmlBundler(distPath, componentsPath, templatePath);
cssBundler(distPath, stylesPath);
assetsBundler(distPath, assetsPath);
