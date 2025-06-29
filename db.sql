
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

CREATE TABLE json_test (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content JSON
);

INSERT INTO json_test (content)
VALUES
    ('["Fast delivery", "24/7 support", "Secure payment"]'),
    ('["Eco-friendly", "Reusable", "Made with recycled materials"]'),
    ('["Free Wi-Fi", "Air conditioning", "Pet-friendly"]');

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
    facilities JSON, -- array (unordered list)
    visiting_info JSON, -- object(?) (address: string, transportation: [], openingHours: string)
    duration_of_visit VARCHAR, -- atau semacam int
    group_size VARCHAR, -- atau semacam int
    ages VARCHAR, -- int min age, max age 
    languages VARCHAR, -- atau json
    map_url VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    status ENUM('held', 'postponed', 'cancelled', 'finished') NOT NULL DEFAULT 'held',
    name VARCHAR(150) NOT NULL,
    description TEXT,
    date DATE,
    time VARCHAR(20),
    price DECIMAL(10, 2),
    category VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id) REFERENCES destinations(id)
        ON DELETE CASCADE -- gapapa kayaknya karena gaada sistem riwayat + 1 admin acc manage 1 destination
);

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT, 
    uuid VARCHAR(36) UNIQUE, -- UUID biasanya memiliki 36 karakter
    price DECIMAL(10, 2), 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE destinations_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    destination_id INT,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

   FOREIGN KEY (destination_id) REFERENCES destinations(id)
        ON DELETE CASCADE
);