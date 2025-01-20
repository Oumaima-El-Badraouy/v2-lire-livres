create database book_create;
use book_create;
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    content TEXT
);delete from books;
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  rating INT NOT NULL,
  review TEXT,
  FOREIGN KEY (book_id) REFERENCES books(id) -- Assurez-vous que la table "books" existe
);ALTER TABLE reviews
ADD COLUMN likes INT DEFAULT 0,
ADD COLUMN dislikes INT DEFAULT 0;
INSERT INTO reviews (book_id, rating, review) VALUES (1, 5, 'Excellent livre!');

insert into reviews (id,book_id,review,likes) values  (88,11,"hy ts nice",3);


INSERT INTO books (titre, content) VALUES 
('Histoire 1', 'Contenu du livre 1'),
('Histoire 2', 'Contenu du livre 2');

-- Insertion des livres avec leurs images
INSERT INTO books (titre, description, content, image)
VALUES 
('Livre 1', 'Description du livre 1', 'Contenu du livre 1', 'images/image1.jpeg'),
('Livre 2', 'Description du livre 2', 'Contenu du livre 2', 'images/image2.jpeg'),
('Livre 3', 'Description du livre 3', 'Contenu du livre 3', 'images/image3.jpeg'),
('Livre 4', 'Description du livre 4', 'Contenu du livre 4', 'images/image4.jpeg'),
('Livre 5', 'Description du livre 5', 'Contenu du livre 5', 'images/image5.jpeg'),
('Livre 6', 'Description du livre 6', 'Contenu du livre 6', 'images/image2.jpeg'),
('Livre 7', 'Description du livre 7', 'Contenu du livre 7', 'images/image4.jpeg'),
('Livre 8', 'Description du livre 8', 'Contenu du livre 8', 'images/image5.jpeg'),
('Livre 9', 'Description du livre 9', 'Contenu du livre 9', 'images/image3.jpeg'),
('Livre 10', 'Description du livre 10', 'Contenu du livre 10', 'images/image1.jpeg');
select*from books;
select*from reviews;
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, book_id)
);
ALTER TABLE books ADD COLUMN author VARCHAR(19);
INSERT INTO books (titre, author) 
VALUES ('Livre 1', 'ahmed'),('Livre 2', 'oumaima'),('Livre 3', 'dkali'),
('Livre 4', 'mhamed'),('Livre 10', 'simo');SELECT * FROM books;


select*from reviews;ALTER TABLE reviews
DROP FOREIGN KEY reviews_ibfk_1, -- Supprimer la contrainte actuelle
ADD CONSTRAINT reviews_ibfk_1 FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;
SHOW CREATE TABLE reviews;ALTER TABLE reviews DROP FOREIGN KEY reviews_ibfk_1;
SHOW INDEX FROM reviews;

ALTER TABLE reviews
ADD CONSTRAINT reviews_ibfk_1 FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;

CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select*from contact_messages;
CREATE TABLE users (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select*from users;