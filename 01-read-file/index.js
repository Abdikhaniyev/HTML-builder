const path = require('node:path');
const fs = require('node:fs');

const filePath = path.resolve(__dirname, 'text.txt');

const stream = new fs.ReadStream(filePath, {
  encoding: 'utf-8',
});

stream.on('data', (chunk) => {
  console.log(chunk);
});

stream.on('error', (error) => {
  console.log(error);
});
