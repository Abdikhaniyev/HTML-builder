const path = require('node:path');
const process = require('node:process');
const fs = require('node:fs');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.resolve(__dirname, '02-write-file.txt');
const question = 'Welcome! Write something: ';

const stream = new fs.WriteStream(filePath, {
  encoding: 'utf-8',
});

readline.question(question, (answer) => {
  stream.write(answer);
  stream.end();
  readline.close();
});

const handleExit = () => {
  console.log('\nBye!');
  process.exit();
};

process.on('exit', handleExit);
process.on('SIGINT', handleExit);
