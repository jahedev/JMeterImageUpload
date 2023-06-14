import re
import csv

sql_file = "existing_users.sql"
csv_file = "existing_users.csv"

# Regular expression pattern to match the values in the SQL statements
pattern = r"values \('.*?', '.*?', '.*?', '.*?', '(.*?)'\)"

# Open the SQL file for reading
with open(sql_file, 'r') as file:
    sql_content = file.read()

# Extract the usernames and passwords using regex
matches = re.findall(pattern, sql_content)

# Create a list of dictionaries with the extracted data
data = [{'username': match[0], 'password': match[1]} for match in zip(matches[::2], matches[1::2])]

# Write the data to the CSV file
with open(csv_file, 'w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=['username', 'password'])
    writer.writeheader()
    writer.writerows(data)

print("Data successfully extracted and written to the CSV file.")
