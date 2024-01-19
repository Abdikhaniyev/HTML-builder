const fs = require('fs');
const path = require('path');

const folderPath = path.resolve(__dirname, 'files');
const destFolderPath = path.resolve(__dirname, 'files-copy');

const copyDir = (src, dest) => {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);

        if (file.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
};

copyDir(folderPath, destFolderPath);
