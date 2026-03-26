const express = require('express');
const path = require('path');
require('dotenv').config();

const jokeRoutes = require('./routes/jokes');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('[App] Starting Express Joke API server...');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

console.log('[App] View engine configured for EJS');
console.log('[App] Public directory:', path.join(__dirname, 'public'));
console.log('[App] Views directory:', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  console.log('[App] GET / request received');
  res.render('index', { joke: null, userName: '', error: null, jokeCategory: null });
});

app.use('/api', jokeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[App] Error:', err.message);
  res.status(err.status || 500).render('index', {
    joke: null,
    userName: '',
    error: err.message || 'Something went wrong. Please try again.',
    jokeCategory: null
  });
});

// 404 handler
app.use((req, res) => {
  console.log('[App] 404 - Route not found:', req.path);
  res.status(404).render('index', {
    joke: null,
    userName: '',
    error: 'Page not found',
    jokeCategory: null
  });
});

app.listen(PORT, () => {
  console.log(`[App] ✓ Joke API website running on http://localhost:${PORT}`);
  console.log('[App] Open your browser and navigate to http://localhost:' + PORT);
});
