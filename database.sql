CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  membership_id VARCHAR(40) NOT NULL UNIQUE,
  role ENUM('librarian','member') NOT NULL DEFAULT 'member',
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  author VARCHAR(120) NOT NULL,
  genre VARCHAR(80) NOT NULL,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NULL,
  type ENUM('ADD','BORROW') NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transaction_book FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transaction_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create the first librarian through the backend seed script after installing dependencies.
