
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