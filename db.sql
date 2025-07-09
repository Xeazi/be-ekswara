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

INSERT INTO admins (username, password_hash) VALUES
('johndoe', '$2b$10$WvGtC/mhrcpnhQfQAEfqrOgSR3XkxNTEz4wtTmtAn5bz6g28WINxK'), -- 1234
('jason', '$2b$10$6SZwGotwKFG7u0g9qdMD1Op58N5ThmSEenoKc9h0//rksB8OfKyam'), -- 4321
('hamlo', '$2b$10$hpOYBHm.oRnz2U6te6eKnuShYdcdOogRKBFNPOJlnNdvOcYrqNcNW'), -- hallo
('daffa', '$2b$10$fs0q6DEasAFnMCsmdxHO6ecIXYr9u8.0OZ2vFV9fD1JM5191KrMCO'); -- herlo


INSERT INTO destinations (
  name, location, park_hours, about, history,
  facilities, visiting_info, duration_of_visit, group_size,
  ages, languages, map_url, created_by
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
  
  'https://maps.google.com/?q=Taman+Wisata+Alam+Angke+Kapuk',
  1
), 
(
    'J-Sky Ferriswheel',
    'East Jakarta',
    '10:00-22:00',
    'J-Sky Ferris Wheel is the tallest observation wheel in Indonesia, located on the rooftop of AEON Mall Jakarta Garden City in East Jakarta. Standing at a height of 69 meters above ground, it offers a spectacular 360-degree view of the city skyline. Since its opening in 2017, it has become a popular landmark and family-friendly destination.',
    "Built to enhance urban recreation and tourism, J-Sky Ferris Wheel was developed as a modern attraction combining leisure and panoramic sightseeing. It features 32 air-conditioned gondolas, ensuring a comfortable ride for visitors of all ages. As part of AEON Mall\'s entertainment offerings, it aims to provide a unique and memorable experience while promoting East Jakarta as a dynamic urban area.",
    JSON_ARRAY(
        'Air-Conditioned Gondolas',
        'Photo Booth & Souvenir Photos',
        'Comfortable Waiting Area',
        'Prayer Room (Mushola) & Toilets',
        'Direct Access from AEON Mall'
    ),
    JSON_OBJECT(
        'address', 'AEON Mall Jakarta Garden City, Lantai 3, Cakung, East Jakarta.',
        'transportation', JSON_ARRAY(
            'Commuter Line: Get off at Cakung Station, then continue by online motorcycle taxi/taxi to AEON Mall JGC.',
            'TransJakarta: Corridor 11 (Pulo Gebang - Kampung Melayu), get off at the Cakung Flyover Bus Stop, then continue with an online motorcycle taxi.'
        ),
        'openingHours', 'Daily, from 10:00 to 22:00 PM.'
    ),
    '± 3-4 Hours',
    'Max. 10 people',
    '7-45 years',
    JSON_ARRAY('Indonesian', 'English'),
    'https://www.google.com/maps?q=AEON+Mall+Jakarta+Garden+City&output=embed',
    2
),
(
    'Taman Agro Cilangkap',
    'East Jakarta',
    '06:30-17:00',
    'Taman Agro Cilangkap is an agro park located in East Jakarta, covering approximately 4 hectares. The park is divided into several sectors that offer a variety of agricultural activities, such as vegetable and ornamental plant cultivation. With its rich natural diversity, the park provides both educational experiences and recreational opportunities for visitors of all ages.',
    'Taman Agro Cilangkap was developed and officially opened in 2007. It was initiated by the City Government of Jakarta to serve as an educational facility for the public and to provide agricultural counseling for farmers. Additionally, it functions as an important green space that supports environmental sustainability in the urban area.',
    '[
        "Vegetable Garden",
        "Ornamental Garden",
        "Crop Plantations",
        "Fish Pond",
        "Jogging Track",
        "Prayer Room (Mushola) & Toilets"
    ]',
    '{
        "address": "Jl. Raya Cilangkap No. 45, RT 8/RW 5, Cilangkap, Cipayung, East Jakarta, DKI Jakarta 13870.",
        "transportation": [
            "Train: Cilangkap Station, Corridor 9",
            "Local Microbuses and Angkot available to the park area"
        ],
        "openingHours": "Daily, from 06:30 AM to 17:00 PM."
    }',
    '± 3-4 Hours',
    'Max. 50 people',
    'All Ages',
    '["Indonesian", "English"]',
    'https://www.google.com/maps?q=Taman+Agro+Wisata+Cilangkap+Jakarta&output=embed',
    3
),
(
    'Cibugary Farm',
    'East Jakarta',
    '08:00-16:00',
    'Cibugary Farm (Cibubur Garden Dairy) is an educational amusement farm located in East Jakarta, combining the fun of a family park with the learning experience of a working dairy farm. Designed for all ages, the park offers a refreshing outdoor escape where visitors can interact with farm animals, enjoy nature-themed attractions, and participate in hands-on agricultural activities.',
    'Cibugary Farm was established to bring the countryside experience closer to the city, creating a unique recreational space with an educational mission. As an urban agro-tourism attraction, the park aims to raise awareness about the importance of farming, animal care, and sustainable food production. Over the years, it has grown into a beloved amusement-style farm where visitors can milk cows, feed animals, explore mini-agro zones, and enjoy playful yet informative experiences.',
    '[
        "Cow & Goat Milking Area",
        "Animal Feeding Zone (cows, goats, rabbits)",
        "Playground Area",
        "Picnic & Rest Area",
        "Mini Shop (milk and dairy products)",
        "Prayer Room (Mushola) & Toilets"
    ]',
    '{
        "address": "Komplek Peternakan DKI, Jl. Peternakan Raya No.1, Cipayung, East Jakarta.",
        "transportation": [
            "Commuter Line: Get off at Stasiun Cawang or Stasiun Tanjung Barat, then continue with an online ride-hailing service.",
            "TransJakarta: Nearest major stop is Kampung Rambutan Terminal, then continue by ojek or angkot.",
            "Private Vehicle: Accessible via Jalan Raya Bogor or the Cibubur exit from Jagorawi Toll Road."
        ],
        "openingHours": "Weekends & Public Holidays: 08:00-16:00"
    }',
    '± 3-4 Hours',
    'Max. 15 people',
    '7-50 years',
    '["Indonesian", "English"]',
    'https://www.google.com/maps?q=Cibugary+Farm+-+Wisata+Edukasi+Cibugary&output=embed',
    4
);



-- Insert data events, atur destination_id sama kaya punyamu, kalo di aku kubuat null semua
INSERT INTO events (destination_id, status, name, description, date, time, price, category, created_by) VALUES
(1, 'held', 'Pameran dan Workshop Seniman Lokal', 'Festival seni tahunan yang menampilkan karya seniman kontemporer indonesia dengan workshop langsung oleh para maestro seni.', '2025-05-08', '10:00-16:00', 68000.00, 'City Park', 1),
(2, 'held', 'Misi Rahasia di Atas Awan', 'Program khusus untuk anak-anak dengan aktivitas edukatif tentang mekanisme bianglala, pengetahuan geografi kota Jakarta, dan tantangan mencari landmark kota dari ketinggian.', '2025-05-10', '16:00-20:00', 115000.00, 'Amusement Parks', 2),
(4, 'held', 'Dairyland Explorers', 'Program edukatif interaktif di peternakan sapi perah. Peserta diajak mengenal anatomi sapi, proses pemerahan susu, dan cara menjaga kebersihan kandang.', '2025-05-18', '08:00-12:00', 100000.00, 'Education Parks', 4),
(1, 'held', 'Pertunjukan dan Workshop Tari Tradisional', 'Festival tari yang menampilkan beragam pertunjukan dari tari tradisional hingga kontemporer dengan workshop langsung dari koreografer ternama.', '2025-05-26', '16:00-22:00', 50000.00, 'City Park', 1),
(3, 'held', 'Harvest Festival & Urban Farming', 'The Harvest Festival & Urban Farming Education is an event that invites the public to experience hands-on learning about plant cultivation, hydroponic vegetable harvesting, and urban agriculture.', '2025-05-29', '08:00-12:00', 0.00, 'Education Parks', 3),
(3, 'held', 'Harvest Festival & Urban Farming', 'The Harvest Festival & Urban Farming Education is an event that invites the public to experience hands-on learning about plant cultivation, hydroponic vegetable harvesting, and urban agriculture.', '2025-05-29', '08:00-12:00', 0.00, 'Education Parks', 3);

INSERT INTO events_image (event_id, name, image_url) VALUES
(1, 'Pameran Seni', 'https://placehold.co/270x270/EBF5FF/7F9CF5?text=Event');

INSERT INTO events (destination_id, status, name, description, date, time, price, category, created_by) VALUES
