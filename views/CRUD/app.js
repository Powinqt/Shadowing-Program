const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const users = []; // in-memory storage

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Add User' });
});

// Create
app.post('/add-user', (req, res) => {
  const { username } = req.body;
  users.push({ id: Date.now(), name: username });
  res.redirect('/users');
});

// Read
app.get('/users', (req, res) => {
  res.render('users', { pageTitle: 'Users', users });
});

// Edit
app.get('/edit-user/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.redirect('/users');
  res.render('edit-user', { pageTitle: 'Edit User', user });
});

app.post('/edit-user', (req, res) => {
  const { id, username } = req.body;
  const user = users.find(u => u.id == id);
  if (user) user.name = username;
  res.redirect('/users');
});

// Delete
app.post('/delete-user', (req, res) => {
  const { id } = req.body;
  const index = users.findIndex(u => u.id == id);
  if (index > -1) users.splice(index, 1);
  res.redirect('/users');
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
