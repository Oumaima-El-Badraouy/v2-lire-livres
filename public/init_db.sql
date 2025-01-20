
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL
);

-- Insérez des exemples de livres
INSERT INTO books (title, description, content) VALUES 
('Livre 1', 'Une description du Livre 1', 'Voici le contenu complet du Livre 1.'),
('Livre 2', 'Une description du Livre 2', 'Voici le contenu complet du Livre 2.'),
('Livre 3', 'Une description du Livre 3', 'Voici le contenu complet du Livre 3.');
