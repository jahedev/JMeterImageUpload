import os
import csv

output_filename = "output.csv"
username_index = 0
email_index = 1

# Get the current directory
current_directory = os.getcwd()

# Get a list of all CSV files in the directory
csv_files = [file for file in os.listdir(current_directory) if file.endswith(".csv") and file != output_filename]

# Dictionary to store unique records based on usernames or emails
unique_records = {}

# Iterate over each CSV file and read its content
for file in csv_files:
    with open(file, 'r', newline='') as csv_file:
        reader = csv.reader(csv_file)
        header = next(reader)  # Get the header
        for row in reader:
            username = row[username_index]
            email = row[email_index]
            if username not in unique_records and email not in unique_records.values():
                unique_records[username] = row

# Write the unique rows to the output CSV file
with open(output_filename, 'w', newline='') as output_file:
    writer = csv.writer(output_file)
    writer.writerow(header)  # Write the header
    writer.writerows(unique_records.values())

print("CSV files merged successfully based on unique usernames and emails into the output CSV file.")
