
-- CAREFUL!!! Executing the below 2 lines:
-- DROP TABLE IF EXISTS files;
-- DROP TABLE IF EXISTS users;

-- Table for storing users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL
);

-- Table for storing files uploaded by users
CREATE TABLE files (
  file_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  file_url VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_description TEXT,
  upload_date TIMESTAMP DEFAULT NOW()
);

/*
-- Example inserts for the users table
INSERT INTO users (username, email, password, firstname, lastname)
VALUES ('john_doe', 'john@example.com', 'password123', 'John', 'Doe');

INSERT INTO users (username, email, password, firstname, lastname)
VALUES ('jane_smith', 'jane@example.com', 'pass123', 'Jane', 'Smith');

INSERT INTO users (username, email, password, firstname, lastname)
VALUES ('alex_wilson', 'alex@example.com', 'secret', 'Alex', 'Wilson');

-- Example inserts for the files table
INSERT INTO files (user_id, file_url, file_name, file_description)
VALUES ((SELECT user_id FROM users WHERE username = 'john_doe'), 'https://example.com/image1.jpg', 'image1.jpg', 'A beautiful landscape');

INSERT INTO files (user_id, file_url, file_name, file_description)
VALUES ((SELECT user_id FROM users WHERE username = 'john_doe'), 'https://example.com/image2.jpg', 'image2.jpg', 'A cute kitten');

INSERT INTO files (user_id, file_url, file_name, file_description)
VALUES ((SELECT user_id FROM users WHERE username = 'jane_smith'), 'https://example.com/image3.jpg', 'image3.jpg', 'An abstract artwork');

*/