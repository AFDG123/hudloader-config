const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 9192;
const JSON_PATH = path.join(__dirname, 'RadarType.json');

if (!fs.existsSync(JSON_PATH)) {
  fs.writeFileSync(JSON_PATH, JSON.stringify({ type: 'Овальный', color: null }), 'utf8');
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.writeHead(200).end();
  }

  if (req.method === 'GET') {
    return res.writeHead(200, { 'Content-Type': 'text/plain' }).end('OK');
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const p1 = body.indexOf('|');
        const command = body.substring(0, p1);
        const filename = body.substring(p1 + 1, body.lastIndexOf('|'));
        const content = body.substring(body.lastIndexOf('|') + 1);

        if (command === 'writeFile') {
          fs.writeFileSync(JSON_PATH, content, 'utf8');
          res.writeHead(200).end('OK');
          console.log(`[SAVE] ✅ ${filename}`);
        } else if (command === 'readFile') {
          if (fs.existsSync(JSON_PATH)) {
            const data = fs.readFileSync(JSON_PATH, 'utf8');
            res.writeHead(200).end(data);
            console.log(`[LOAD] ✅ ${filename}`);
          } else {
            res.writeHead(200).end('');
          }
        } else {
          res.writeHead(400).end('Unknown command');
        }
      } catch (e) {
        res.writeHead(500).end('Error: ' + e.message);
      }
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Сервер запущен на порту ${PORT}`);
});
