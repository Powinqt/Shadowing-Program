const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// EJS setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory product store
let products = [];

// Routes
app.get('/', (req, res) => {
  res.render('index', { products });
});

app.get('/add-product', (req, res) => {
  res.render('users');
});

app.post('/add-product', upload.single('image'), (req, res) => {
  products.push({
    id: Date.now().toString(),
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.file ? '/uploads/' + req.file.filename : ''
  });
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  res.render('edit', { product });
});

app.post('/edit/:id', upload.single('image'), (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index >= 0) {
    products[index].title = req.body.title;
    products[index].price = req.body.price;
    products[index].description = req.body.description;
    if (req.file) products[index].imageUrl = '/uploads/' + req.file.filename;
  }
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index >= 0) {
    // Remove image from uploads
    if (products[index].imageUrl) {
      fs.unlinkSync(path.join(__dirname, 'public', products[index].imageUrl));
    }
    products.splice(index, 1);
  }
  res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
