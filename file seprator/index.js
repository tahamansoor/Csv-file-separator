const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { promisify } = require('util');

const sourceFile = './input-files/'; // Replace with your source CSV file
const maxLinesPerFile = 24999;

let currentLine = 0;
let currentFileIndex = 1;
let outputFilePath = createOutputFilePath(currentFileIndex);
let outputStream = createNewOutputStream();

const readdirAsync = promisify(fs.readdir);

(async () => {
  try {
    const files = await readdirAsync(sourceFile);

    for (const file of files) {
      await processCSVFile(file);
    }
  } catch (err) {
    console.error(err);
  }
})();

async function processCSVFile(file) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path.join(sourceFile, file));
    let firstLine = true;

    readStream
      .pipe(csv())
      .on('data', (row) => {
        if (currentLine === 0) {
          outputStream.write(Object.keys(row).join(',') + '\n');
        }

        const line = Object.values(row).join(',');

        if (currentLine < maxLinesPerFile - 1) {
          outputStream.write(line + '\n');
        } else {
          outputStream.write(line);
        }

        currentLine++;

        if (currentLine >= maxLinesPerFile) {
          currentLine = 0;
          currentFileIndex++;
          outputFilePath = createOutputFilePath(currentFileIndex);
          outputStream.end();
          outputStream = createNewOutputStream();
        }
      })
      .on('end', () => {
        console.log(`Finished processing ${file}`);
        resolve();
      })
      .on('error', (error) => {
        console.error(`Error processing ${file}: ${error.message}`);
        reject(error);
      });
  });
}
function createOutputFilePath(index) {
  return path.join('./output-files', `${index}-us-settlement-x.csv`);
}

function createNewOutputStream() {
  return fs.createWriteStream(outputFilePath, { flags: 'a' });
}
