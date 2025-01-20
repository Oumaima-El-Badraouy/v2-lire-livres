const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const PDFDocument = require('pdfkit'); // Importer pdfkit pour générer des PDFs
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();
app.use(cors());
app.use('/images', express.static('images'));
const PORT = 3000;const bcrypt = require('bcrypt');
const crypto = require('crypto');
const session = require('express-session');



app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',   // Remplacez avec votre utilisateur MySQL
  password: '',   // Remplacez avec votre mot de passe MySQL
  database: 'book_create'  // Remplacez avec votre base de données
});


// Vérifier la connexion MySQL
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion à la base de données réussie');
});


const nodemailer = require('nodemailer');

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'omaimaelbdraouy@gmail.com', // Votre email Gmail
        pass: 'ouma1234ima' // Le mot de passe d'application généré
    }
});

const sendEmail = (recipient, subject, message) => {
    const mailOptions = {
        from: 'omaimaelbdraouy@gmail.com',
        to: recipient,
        subject: subject,
        text: message
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;


app.post('/save-download', (req, res) => {
  const { book_id, user_id, file_name, download_time } = req.body;

  // Préparer la requête SQL pour insérer les données
  const query = 'INSERT INTO downloads (book_id, user_id, file_name, download_time) VALUES (?, ?, ?, ?)';
  const values = [book_id, user_id, file_name, download_time];

  db.execute(query, values, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'enregistrement du téléchargement:', err);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement.' });
    }
    res.json({ message: 'Téléchargement enregistré avec succès', id: results.insertId });
  });

 

// Get all books
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching books' });
    }
    res.json(results);
  });
});


 app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching books' });
    }
    res.json(results);
  });
});

app.post('/users', (req, res) => {
    const { email, nom, prenom, motdepasse } = req.body;
    db.query('INSERT INTO users (email, username,password) VALUES (?, ?, ?, ?)', [email,username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
        }
        res.json({ id: results.insertId, email, nom, prenom });
    });
  });
  
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
        }
        res.json({ message: 'Utilisateur supprimé' });
    });
  });
  app.put('/users/:id', (req, res) => {
const { id } = req.params;
const { email, nom, prenom, motdepasse } = req.body;

db.query(
    'UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?',
    [email,username, password, id],
    (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur mis à jour avec succès' });
    }
);
});






// Route pour ajouter un livre et envoyer des notifications
app.post('/api/books', (req, res) => {
  const { titre, description, image, content, author, category } = req.body;

  // Validation des champs
  if (!titre || !description || !content || !author || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insérer le livre dans la base de données
  const query = 'INSERT INTO books (titre, description, image, content, author, category) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [titre, description, image, content, author, category], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error adding book' });
    }

    // Récupérer les emails des utilisateurs
    db.query('SELECT email FROM users', (err, users) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving users');
      }

      // Envoyer un email à chaque utilisateur
      const subject = 'New Book Added!';
      const message = `A new book titled "${titre}" has been added. Check it out!`;
      const emailPromises = users.map((user) => sendEmail(user.email, subject, message));

      // Attendre que tous les emails soient envoyés
      Promise.all(emailPromises)
        .then(() => res.json({ message: 'Book added and notifications sent!' }))
        .catch((emailErr) => {
          console.error(emailErr);
          res.status(500).send('Error sending notifications');
        });
    });
  });
});


// Delete a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  db.query('DELETE FROM books WHERE id = ?', [bookId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting book' });
    }
    res.json({ message: 'Book deleted successfully!' });
  });
});




// Récupérer les messages de contact
app.get('/api/contact_messages', (req, res) => {
  db.query('SELECT * FROM contact_messages', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages de contact:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results);
  });
});

// Récupérer les téléchargements
app.get('/api/downloads', (req, res) => {
  db.query('SELECT * FROM downloads', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des téléchargements:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results);
  });
});



// Récupérer les favoris
app.get('/api/favorites', (req, res) => {
  db.query('SELECT * FROM favorites', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des favoris:', err);
      return res.status(500).json({ error: 'Erreur de serveur' });
    }
    res.json(results);
  });
});

app.use(session({
  secret: 'tonSecret',
  resave: false,
  saveUninitialized: true,
}));
const jwt = require('jsonwebtoken');

// Fonction pour vérifier le token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Récupérer le token depuis les headers
  
  if (!token) {
    return res.status(403).send('Aucun token fourni');
  }
  
  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).send('Token invalide');
    }
    req.user = decoded;  // Ajouter les données de l'utilisateur à la requête
    next();  // Passer au middleware suivant ou à la route protégée
  });
}

// Route protégée avec JWT
app.get('/index', verifyToken, (req, res) => {
  res.send('Bienvenue à la page d\'index');
});



});
// Route pour rechercher un livre par titre ou auteur
app.get('/search', async (req, res) => {
  const searchQuery = req.query.query;

  try {
    const [books] = await db.query(`
      SELECT * FROM books 
      WHERE  title LIKE ? or author Like ?`,
      [ `%${searchQuery}%,%${searchQuery}%`] // Recherche par titre ou auteur
    );
    res.json(books); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la recherche' });
  }
});

app.get('/downloads/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT books.id, books.titre, books.author, books.image, downloads.file_name, downloads.download_time
    FROM downloads
    JOIN books ON downloads.book_id = books.id
    WHERE downloads.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});






// Endpoint : Obtenir la liste des histoires
app.get('/stories', (req, res) => {
  db.query('SELECT id, titre, description, image FROM books ORDER BY id LIMIT 12', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des histoires' });
    }
   
    res.json(results);
  });
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

});
// Ajouter un livre
app.post('/stories', (req, res) => {
  const { titre, description, content, image, author } = req.body;

  if (!titre || !description || !content) {
    return res.status(400).json({ message: 'Les champs titre, description et contenu sont obligatoires.' });
  }

  const query = 'INSERT INTO books (titre, description, content, image, author) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [titre, description, content, image, author], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout du livre.' });
    }
    
    res.status(200).json({ message: 'Livre ajouté avec succès.', bookId: result.insertId });
    // Usage
sendEmailNotification('New Book Available');
  });
});
// Servir les fichiers frontend (folder "front")
app.use(express.static(path.join(__dirname, "../front")));

// API pour soumettre le formulaire
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation simple
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis !" });
  }

  // Insertion dans la base de données
  const sql = "INSERT INTO contact_messages (full_name, email, subject, message) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion :", err);
      return res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
    res.status(200).json({ success: true, message: "Message envoyé avec succès !" });
  });
});



app.put('/stories/:id', (req, res) => {
  const { id } = req.params;
  const { titre, description, content, image, author } = req.body;

  const query = `UPDATE books SET titre = ?, description = ?, content = ?, image = ?, author = ? WHERE id = ?`;
  connection.query(query, [titre, description, content, image, author, id], (err, result) => {
      if (err) {
          console.error('Erreur lors de la mise à jour:', err);
          return res.status(500).json({ error: 'Erreur lors de la mise à jour du livre' });
      }
      res.status(200).json({ message: 'Livre mis à jour avec succès' });
  });
});

app.delete('/stories/:id', (req, res) => {
  const bookId = req.params.id;
  console.log(`Suppression du livre avec ID: ${bookId}`);

  // Requête SQL pour supprimer le livre
  const query = 'DELETE FROM books WHERE id = ?';

  db.query(query, [bookId], (err, result) => {
      if (err) {
          console.error('Erreur lors de la suppression du livre:', err);
          return res.status(500).json({ message: 'Erreur lors de la suppression du livre.' });
      }

      console.log(`Résultat de la suppression: ${result.affectedRows} ligne(s) supprimée(s)`);

      if (result.affectedRows === 0) {
          console.log(`Livre avec ID ${bookId} non trouvé.`);
          return res.status(404).json({ message: 'Livre non trouvé.' });
      }

      console.log(`Livre avec ID ${bookId} supprimé avec succès.`);
      res.status(200).json({ message: 'Livre supprimé avec succès.' });
  });
});

// Mettre à jour une review
app.put('/api/reviews/:id', (req, res) => {
  const reviewId = req.params.id;
  const { rating, review } = req.body;

  if (!rating || !review) {
    return res.status(400).json({ message: 'Rating et review sont requis.' });
  }

  const query = 'UPDATE reviews SET rating = ?, review = ? WHERE id = ?';

  db.query(query, [rating, review, reviewId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la review.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review non trouvée.' });
    }

    res.status(200).json({ message: 'Review mise à jour avec succès.' });
  });
});

app.delete("/api/reviews/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM reviews WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Review deleted successfully.");
  });
});


app.get('/stories/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const storyId = req.params.id;

  db.query('SELECT * FROM books WHERE id = ?', [storyId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur du serveur.' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Livre non trouvé.' });
    } else {
      const book = results[0];
      res.json({
        id: book.id,
        title: book.titre,
        content: book.content,
         // Si une image est incluse dans votre base de données
      });
    }
  });
});







// Route pour ajouter un favori
app.post('/add-favorite', (req, res) => {
 // Récupérer user_id et book_id depuis le corps de la requête
const { user_id, book_id } = req.body;

// Vérification si l'utilisateur existe
db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, results) => {
  if (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur lors de la vérification de l\'utilisateur.' });
  }
  if (results.length === 0) {
    return res.status(400).json({ message: 'L\'utilisateur n\'existe pas.' });
  }

  // Si l'utilisateur existe, insérer le favori
  const query = `INSERT INTO favorites (user_id, book_id) VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP`;
  db.query(query, [user_id, book_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout du favori.' });
    }
    res.status(200).json({ message: 'Livre ajouté aux favoris avec succès.' });
  });
});

});
// Route pour récupérer les favoris d'un utilisateur
app.get('/favorites/:id', (req, res) => {
  console.log(`Requête reçue pour l'utilisateur ID : ${req.params.id}`);
  const userId = req.params.id;
  const query = `
    SELECT books.id, books.titre, books.author,books.image
    FROM favorites
    JOIN books ON favorites.book_id = books.id
    WHERE favorites.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});



app.get('/person/:id', (req, res) => {
  const personId = req.params.id;

  db.query('SELECT * FROM users WHERE user_id = ?', [personId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des informations' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Personne non trouvée' });
    }

    res.json(results[0]); // Send the first result from the query
  });
});
app.put("/person/:id", (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  if (users[userId]) {
    users[userId].username = username || users[userId].username;
    users[userId].email = email || users[userId].email;
    res.status(200).json({ message: "Mise à jour réussie", user: users[userId] });
  } else {
    res.status(404).json({ message: "Utilisateur introuvable" });
  }
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "L'email et le mot de passe sont requis."
    });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Erreur de base de données : ', err);
      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur."
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect."
      });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      userId: user.user_id
    });
  });
});


app.post('/signup', async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  console.log("Données reçues :", req.body);

  if (password !== confirm_password) {
    return res.json({ success: false, message: "Les mots de passe ne correspondent pas." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Mot de passe haché :", hashedPassword);  // Log du mot de passe haché

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Erreur SQL :", err);
        return res.json({ success: false, message: "Une erreur est survenue lors de l'inscription.", error: err });
      }

      // Retrieve the newly created user_id
      const userId = result.insertId;

      // Send the userId as part of the response
      return res.json({
        success: true,
        message: "Inscription réussie !",
        userId: userId // Send userId in the response
      });
    });
  } catch (error) {
    console.error("Erreur interne :", error);
    return res.json({ success: false, message: "Une erreur est survenue lors de l'inscription.", error: error });
  }
});


app.get("/api/contact_messages", (req, res) => {
  db.query("SELECT * FROM contact_messages", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Route pour récupérer les commentaires
app.get('/reviews/:id', (req, res) => {
  const bookId = req.params.id;
  db.query('SELECT * FROM reviews WHERE book_id = ?', [bookId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    } else {
      res.json(results);
    }
  });
});

app.delete("/api/contact_messages/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM contact_messages WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Contact message deleted successfully.");
  });
});
// Route pour soumettre un commentaire
app.post('/submit-review', (req, res) => {
  const { book_id, rating, review } = req.body;
  db.query(
    'INSERT INTO reviews (book_id, rating, review) VALUES (?, ?, ?)',
    [book_id, rating, review],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire.' });
      } else {
        res.json({ message: 'Commentaire ajouté avec succès.' });
      }
    }
  );
});


app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reviews WHERE id = ?', [id], (err) => {
      if (err) {
          return res.status(500).json({ message: 'Erreur lors de la suppression de la review' });
      }
      res.json({ message: 'Review supprimée' });
  });
});
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée.' });
});




app.post('/synthesize', async (req, res) => {
  const { text, languageCode } = req.body;

  const request = {
    input: { text },
    voice: { languageCode, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const fileName = `output-${Date.now()}.mp3`;
    const writeFile = util.promisify(fs.writeFile);

    await writeFile(fileName, response.audioContent, 'binary');
    res.sendFile(fileName, { root: __dirname }, () => {
      fs.unlinkSync(fileName);  // Suppression du fichier après envoi
    });
  } catch (error) {
    res.status(500).send('Erreur lors de la synthèse vocale : ' + error.message);
  }
});


app.post('/users', (req, res) => {
  const { email, nom, prenom, motdepasse } = req.body;
  db.query('INSERT INTO users (email, nom, prenom, motdepasse) VALUES (?, ?, ?, ?)', [email, nom, prenom, motdepasse], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur' });
      }
      res.json({ id: results.insertId, email, nom, prenom });
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) {
          return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
      }
      res.json({ message: 'Utilisateur supprimé' });
  });
});






// app.get('/books/category/:category', (req, res) => {
//   const category = req.params.category;
//   const query = 'SELECT * FROM booksp WHERE category = ?';
//   db.query(query, [category], (err, results) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.json(results);
//     }
//   });
// });
// app.get('/books/language/:language', (req, res) => {
//   const language = req.params.language;
//   const query = 'SELECT * FROM booksp WHERE langue = ?';
//   db.query(query, [language], (err, results) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.json(results);
//     }
//   });
// });


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});