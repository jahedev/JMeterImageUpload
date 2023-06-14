const fs = require('fs');
const csv = require('csv-writer').createObjectCsvWriter;

const sqlFile = 'existing_users.sql';
const csvFile = 'existing_users.csv';

// Regular expression pattern to match the values in the SQL statements
const pattern = /values \('.*?', '.*?', '.*?', '.*?', '(.*?)'\)/g;

// Read the SQL file
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Extract the usernames and passwords using regex
const matches = [...sqlContent.matchAll(pattern)];

// Create an array of objects with the extracted data
const data = matches.map((match) => ({
  username: match[1],
  password: match[2],
}));

// Write the data to the CSV file
const csvWriter = csv({
  path: csvFile,
  header: [{ id: 'username', title: 'username' }, { id: 'password', title: 'password' }],
});

csvWriter.writeRecords(data)
  .then(() => {
    console.log('Data successfully extracted and written to the CSV file.');
  })
  .catch((error) => {
    console.error('Error writing to the CSV file:', error);
  });
