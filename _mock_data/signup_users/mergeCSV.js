const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const outputFilename = 'signup_users.csv';
const usernameIndex = 0;
const emailIndex = 1;

// Get the current directory
const currentDirectory = process.cwd();

// Get a list of all CSV files in the directory
const csvFiles = fs
  .readdirSync(currentDirectory)
  .filter((file) => file.endsWith('.csv') && file !== outputFilename);

// Object to store unique records based on usernames or emails
const uniqueRecords = {};

// Iterate over each CSV file and read its content
csvFiles.forEach((file) => {
  const filePath = path.join(currentDirectory, file);
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('headers', (headers) => {
      // Skip the headers
    })
    .on('data', (row) => {
      const username = row[usernameIndex];
      const email = row[emailIndex];
      if (!(username in uniqueRecords) && !Object.values(uniqueRecords).includes(email)) {
        uniqueRecords[username] = row;
      }
    })
    .on('end', () => {
      console.log(`Processed ${file}`);
    });
});

// Write the unique rows to the output CSV file
const outputFilePath = path.join(currentDirectory, outputFilename);
const outputData = Object.values(uniqueRecords);
const header = Object.keys(outputData[0]).join(',');
fs.writeFileSync(outputFilePath, `${header}\n`);
outputData.forEach((row) => {
  const rowData = Object.values(row).join(',');
  fs.appendFileSync(outputFilePath, `${rowData}\n`);
});

console.log('CSV files merged successfully based on unique usernames and emails into the output CSV file.');
