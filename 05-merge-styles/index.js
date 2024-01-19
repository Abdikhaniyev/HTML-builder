const fs = require('fs/promises');
const path = require('path');

const distPath = path.resolve(__dirname, 'project-dist');
const stylesPath = path.resolve(__dirname, 'styles');

const cssBundler = async (distPath, stylesPath) => {
  const extension = '.css';
  const bundleName = 'bundle.css';

  try {
    const files = await fs.readdir(stylesPath);
    const cssFiles = files.filter((file) => path.extname(file) === extension);

    const fileContents = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.resolve(stylesPath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      }),
    );

    const bundle = fileContents.join('');

    const bundlePath = path.resolve(distPath, bundleName);

    await fs.writeFile(bundlePath, bundle);

    console.log('CSS bundle has been created!');
  } catch (err) {
    console.log(err);
  }
};

cssBundler(distPath, stylesPath);
