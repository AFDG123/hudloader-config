const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const FILE = path.join(__dirname, 'config.json');
const DEFAULT = { radar: { type: "Овальный", color: null }, interface: { color: null } };

app.use(cors());
app.use(express.json());

const read = () => {
  try { if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch {}
  return DEFAULT;
};

const save = (d) => {
  const c = read();
  Object.assign(c, d);
  fs.writeFileSync(FILE, JSON.stringify(c, null, 2), 'utf8');
};

app.get('/', (req, res) => res.json(read()));
app.post('/', (req, res) => { save(req.body); res.json({ success: true }); });

app.listen(PORT, () => console.log(`Server ${PORT}`));