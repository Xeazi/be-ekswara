
-- yg dari bang bil buat tes awal

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

INSERT INTO roles (name)
VALUES 
  ('student'),
  ('admin'),
  ('instructor');

INSERT INTO students (firstname, lastname, email, phone_number, role_id)
VALUES 
  ('Alice', 'Tanaka', 'alice.tanaka@example.com', '081234567890', 1),
  ('Bob', 'Kusuma', 'bob.kusuma@example.com', '089876543210', 1),
  ('Daffa', 'Ghosan', 'ghosan.webdev@example.com', '08126942069', 2);



-- bukan tes:

CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR()255 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(50) NOT NULL,
    park_hours VARCHAR NOT NULL,
    about TEXT,
    history TEXT,
    facilities JSON,
);

-- progress wak