// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const PORT = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

let cheatSheets = [];

// Home page
app.get('/', (req, res) => {
  let html = `
    <h1>Post a Cheat Sheet</h1>
    <form method="POST" action="/submit" enctype="multipart/form-data">
      <input name="title" placeholder="Title" required><br><br>
      <textarea name="description" placeholder="Description" required></textarea><br><br>
      <input type="file" name="image"><br><br>
      <button type="submit">Post</button>
    </form>
    <hr>
    <h2>All Cheat Sheets</h2>
  `;

  cheatSheets.forEach(sheet => {
    html += `<div>
      <h3>${sheet.title}</h3>
      <p>${sheet.description}</p>`;
    if (sheet.image) {
      html += `<img src="${sheet.image}" alt="CheatSheet Image" width="300">`;
    }
    html += `</div><hr>`;
  });

  res.send(html);
});

// Handle form submission
app.post('/submit', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  cheatSheets.push({ title, description, image });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});