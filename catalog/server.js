const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data', 'artworks.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/artworks', (req, res) => {
  res.json(readData());
});

app.post('/api/artworks', (req, res) => {
  const artworks = readData();
  const newArtwork = {
    id: Date.now().toString(),
    title: req.body.title || '',
    description: req.body.description || '',
    image: req.body.image || ''
  };
  artworks.push(newArtwork);
  writeData(artworks);
  res.json(newArtwork);
});

app.put('/api/artworks/:id', (req, res) => {
  const artworks = readData();
  const idx = artworks.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.sendStatus(404);
  artworks[idx] = { ...artworks[idx], ...req.body };
  writeData(artworks);
  res.json(artworks[idx]);
});

app.delete('/api/artworks/:id', (req, res) => {
  let artworks = readData();
  const idx = artworks.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.sendStatus(404);
  artworks.splice(idx, 1);
  writeData(artworks);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Catalog server running on http://localhost:${PORT}`);
});
