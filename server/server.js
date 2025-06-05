// Simple Express server. Ensures catalog/data exists and uses asynchronous file operations.
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join('catalog', 'data');

// Ensure catalog/data directory exists on startup
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Ensured ${DATA_DIR} exists`);
} catch (err) {
  console.error('Failed to create data directory:', err);
}

app.use(express.json());

const DATA_FILE = path.join(DATA_DIR, 'data.json');

// Example route that returns the JSON content of data.json
app.get('/data', async (req, res) => {
  try {
    const data = await fs.promises.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ error: 'Data file not found' });
    }
    console.error('Error reading data file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example route that writes JSON to data.json
app.post('/data', async (req, res) => {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error writing data file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
