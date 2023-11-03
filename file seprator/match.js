const fs = require('fs');
const path = require('path');

const sourceDirectory = './input-files/'; // Replace with the directory containing the original files
const reconstructedFilePath = './reconstructed-files/reconstructed.csv'; // Replace with the path to the reconstructed file

// Read the original files from the source directory
const originalFiles = fs.readdirSync(sourceDirectory);

// Initialize variables to store the sums of data
let originalSum = '';
let reconstructedSum = '';

// Loop through the original files to calculate the sum of their data
originalFiles.forEach((originalFile) => {
    const filePath = path.join(sourceDirectory, originalFile);
    const originalData = fs.readFileSync(filePath, 'utf8');
    originalSum += originalData;
})

// Read the entire content of the reconstructed file
reconstructedSum = fs.readFileSync(reconstructedFilePath, 'utf8');

// Split the data into lines
const originalLines = originalSum.split('\n');
const reconstructedLines = reconstructedSum.split('\n');

// Compare the sum of data from the original files to the data in the reconstructed file line by line
if (originalLines.length === reconstructedLines.length) {
    let linesMatch = true;
    for (let i = 0; i < originalLines.length; i++) {
        if (originalLines[i] !== reconstructedLines[i]) {
            console.log(`Line ${i + 1} does not match. Original: "${originalLines[i]}", Reconstructed: "${reconstructedLines[i]}"`);
            linesMatch = false;
        }
    }

    if (linesMatch) {
        console.log('All lines match between the original files and the reconstructed file.', originalLines.length, reconstructedLines.length);
    } else {
        console.log('Not all lines match between the original files and the reconstructed file.');
    }
} else {
    console.log('The number of lines in the original files does not match the reconstructed file.', originalLines.length, reconstructedLines.length);
}
