const path = require('node:path');
const { readdir } = require('node:fs/promises');
const { stat } = require('node:fs');

const filePath = path.resolve(__dirname, 'secret-folder');

const readFiles = async (folderPath) => {
  const files = await readdir(folderPath, { withFileTypes: true });
  files.forEach((file) => {
    stat(path.resolve(folderPath, file.name), (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      let result = '';
      const isFile = file.isFile();
      if (isFile) {
        const fileExtension = path.extname(file.name).slice(1);
        const fileName = isFile ? file.name.split('.')[0] : file.name;
        const fileSize = stats.size;

        result = `${fileName} - ${fileExtension} - ${fileSize}bytes`;
        console.log(result);
      }
    });
  });
};

readFiles(filePath);
