const http = require('http');
const fs = require('fs');
const path = require('path');

const users = [];
const sessions = {};
const posts = [];

function sendJSON(res, status, data) {
  res.writeHead(status, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data));
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      callback(null, data);
    } catch(err) {
      callback(err);
    }
  });
}

function handleSignup(req, res) {
  parseBody(req, (err, data) => {
    if (err) return sendJSON(res, 400, {error: 'Invalid JSON'});
    const {username, password} = data;
    if (!username || !password) return sendJSON(res, 400, {error: 'Missing fields'});
    if (users.find(u => u.username === username)) return sendJSON(res, 400, {error: 'User exists'});
    users.push({username, password});
    sendJSON(res, 200, {success: true});
  });
}

function handleLogin(req, res) {
  parseBody(req, (err, data) => {
    if (err) return sendJSON(res, 400, {error: 'Invalid JSON'});
    const {username, password} = data;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return sendJSON(res, 401, {error: 'Invalid credentials'});
    const token = Math.random().toString(36).slice(2);
    sessions[token] = username;
    sendJSON(res, 200, {token});
  });
}

function handleCreatePost(req, res) {
  const token = req.headers['authorization'];
  const username = sessions[token];
  if (!username) return sendJSON(res, 401, {error: 'Unauthorized'});
  parseBody(req, (err, data) => {
    if (err) return sendJSON(res, 400, {error: 'Invalid JSON'});
    const {content} = data;
    if (!content) return sendJSON(res, 400, {error: 'No content'});
    const post = {id: posts.length + 1, username, content, time: Date.now()};
    posts.push(post);
    sendJSON(res, 200, post);
  });
}

function handleGetPosts(req, res) {
  sendJSON(res, 200, posts);
}

function serveStatic(req, res) {
  let filepath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.slice(1));
  if (!filepath.startsWith(__dirname)) { sendJSON(res, 403, {error: 'Forbidden'}); return; }
  fs.readFile(filepath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filepath);
    const type = ext === '.js' ? 'text/javascript' : 'text/html';
    res.writeHead(200, {'Content-Type': type});
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/signup') return handleSignup(req, res);
  if (req.method === 'POST' && req.url === '/login') return handleLogin(req, res);
  if (req.method === 'POST' && req.url === '/posts') return handleCreatePost(req, res);
  if (req.method === 'GET' && req.url === '/posts') return handleGetPosts(req, res);
  if (req.method === 'GET') return serveStatic(req, res);
  res.writeHead(404); res.end('Not found');
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
