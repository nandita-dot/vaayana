const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Single Page Application (SPA) static server
const server = http.createServer((req, res) => {
  const filePath = path.join(distDir, req.url.split('?')[0]);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    // SPA Fallback: serve index.html for all client routes
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(indexHtml);
  }
});

server.listen(4173, async () => {
  const routes = [
    '/',
    '/teacher',
    '/classroom',
    '/library',
    '/lesson/scert-std4-maths-ch1-lines-and-shapes',
    '/lesson/scert-std4-maths-ch5-its-time',
    '/lesson/scert-std4-maths-ch6-decreasing-numbers'
  ];

  console.log('Testing DRISHTI Routes:');
  let passed = true;

  for (const route of routes) {
    await new Promise((resolve) => {
      http.get(`http://127.0.0.1:4173${route}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const ok = res.statusCode === 200 && (body.includes('VAAYANA') || body.includes('വായന'));
          console.log(`- Route ${route.padEnd(40)} => Status: ${res.statusCode} | SPA Match: ${ok}`);
          if (!ok) passed = false;
          resolve();
        });
      }).on('error', (err) => {
        console.error(`- Route ${route} => ERROR: ${err.message}`);
        passed = false;
        resolve();
      });
    });
  }

  server.close(() => {
    console.log('\nAll routes verified successfully:', passed);
    process.exit(passed ? 0 : 1);
  });
});
