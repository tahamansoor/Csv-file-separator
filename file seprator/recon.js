const fs = require('fs');
const path = require('path');

const sourceDirectory = './output-files/'; // Replace with the directory containing split files
const outputDirectory = './reconstructed-files/'; // Replace with the directory where you want to save the reconstructed file
fs.readdir(sourceDirectory, (err, files) => {
    if (err) {
        return console.log(err);
    }

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }

    // Sort the files to ensure they are reconstructed in the correct order
    files.sort((a, b) => parseInt(a) - parseInt(b));

    const reconstructedFilePath = path.join(outputDirectory, 'reconstructed.csv');
    const outputStream = fs.createWriteStream(reconstructedFilePath);

    // Iterate through the split files and concatenate them into the reconstructed file
    files.forEach((file) => {
        const filePath = path.join(sourceDirectory, file);
        const data = fs.readFileSync(filePath, 'utf8');
        outputStream.write(data);
    });

    outputStream.end();
    console.log('Reconstruction complete.');
});