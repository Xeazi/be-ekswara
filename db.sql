
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

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(50),
    park_hours VARCHAR(15),
    about TEXT,
    history TEXT,
    facilities JSON, -- array (unordered list)
    visiting_info JSON, -- object(?) (address: string, transportation: [], openingHours: string)
    duration_of_visit VARCHAR(20), -- atau semacam int
    group_size VARCHAR(20), -- atau semacam int
    ages VARCHAR(20), -- int min age, max age 
    languages JSON,
    map_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,

    FOREIGN KEY (created_by) REFERENCES admins(id)
        ON DELETE SET NULL
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
    created_by INT,

    FOREIGN KEY (destination_id) REFERENCES destinations(id)
        ON DELETE SET NULL, -- gapapa kayaknya karena gaada sistem riwayat + 1 admin acc manage 1 destination
                            -- eh tapi transactionnya gpp?? (catetan lagi 1 hari setelah: ku ganti set null aja)
    FOREIGN KEY (created_by) REFERENCES admins(id) 
        ON DELETE SET NULL 
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
    name VARCHAR(255), -- url mengunakan ini mungkin?
    image_url VARCHAR(255), -- perlu?
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id) REFERENCES destinations(id)
        ON DELETE CASCADE
);

CREATE TABLE events_image (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT,
    name VARCHAR(255), -- url mengunakan ini mungkin?
    image_url VARCHAR(255), -- perlu?
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE
);

-- insert

INSERT INTO destinations (
  name, location, park_hours, about, history,
  facilities, visiting_info, duration_of_visit, group_size,
  ages, languages, map_url
) VALUES (
  'Taman Ismail Marzuki',
  'Central Jakarta',
  '08:00-17:00',
  "Ismail Marzuki Park, commonly known as TIM, is a prominent center for arts, culture, and science located at Jalan Cikini Raya No. 73, Menteng, Central Jakarta. It was officially inaugurated on November 10, 1968, by Governor Ali Sadikin and was established on the former site of Taman Raden Saleh, which once housed Jakarta's zoo before it moved to Ragunan.",
  'Named after the legendary Indonesian composer Ismail Marzuki, TIM was created as a space for creative expression and cultural development in Jakarta. It also serves as the home of the Jakarta Arts Council (Dewan Kesenian Jakarta), which plays a key role in supporting the local arts scene.',
  
  '["Teater Jakarta", "Jakarta Planetarium and Observatory", "Graha Bhakti Budaya", "Jakarta Public Library", "Cipta Galleries I, II, III", "Jakarta Institute of the Arts (IKJ)", "Prayer Room (Mushola) & Toilets"]',
  
  '{
    "address": "Jalan Cikini Raya No. 73, Menteng, Central Jakarta.",
    "transportation": ["Commuter Line: Cikini Station, followed by a short walk or ride.", "TransJakarta: Corridor 5H (Kampung Melayu-Tanah Abang) or 6H (Senen-Lebak Bulus).", "MRT: Bundaran HI Station, then continue via online ride-hailing service."],
    "openingHours": "Daily, 08:00-17:00"
  }',
  
  '2-3 Hours',
  'Max. 15 people',
  '18-50 years',
  
  '["Bahasa Indonesia", "English"]',
  
  'https://maps.google.com/?q=Taman+Wisata+Alam+Angke+Kapuk'
);
