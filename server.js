const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9192;
const JSON_PATH = path.join(__dirname, 'RadarType.json');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
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
          res.writeHead(200); res.end('OK');
        } else if (command === 'readFile') {
          if (fs.existsSync(JSON_PATH)) {
            res.writeHead(200); res.end(fs.readFileSync(JSON_PATH, 'utf8'));
          } else {
            res.writeHead(200); res.end('');
            console.log('[LOAD] ⚠️ Файл не найден, отправлен пустой ответ');
          }
        } else {
          res.writeHead(400); res.end('Unknown command');
        }
      } catch (e) {
        res.writeHead(500); res.end('Error: ' + e.message);
      }
    });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
