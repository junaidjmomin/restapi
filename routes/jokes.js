const express = require('express');
const axios = require('axios');

const router = express.Router();

const JOKE_API_URL = 'https://sv443.net/jokeapi/v2/joke/Any';

/**
 * POST /api/joke
 * Fetches a joke from JokeAPI based on user input
 */
router.post('/joke', async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name || name.trim() === '') {
      return res.render('index', {
        joke: null,
        userName: '',
        error: 'Please enter your name to get a joke!'
      });
    }

    const userName = name.trim();
    console.log(`[App] Fetching joke for user: ${userName}`);

    // Fetch joke from JokeAPI with safety filters
    const response = await axios.get(JOKE_API_URL, {
      params: {
        safe: true, // Exclude explicit jokes
        format: 'json'
      },
      timeout: 5000 // 5 second timeout
    });

    if (response.status === 200) {
      const data = response.data;

      if (data.error) {
        return res.render('index', {
          joke: null,
          userName: userName,
          error: 'No jokes available at the moment. Please try again!'
        });
      }

      let jokeText = '';
      if (data.type === 'single') {
        jokeText = data.joke;
      } else if (data.type === 'twopart') {
        jokeText = `${data.setup} ... ${data.delivery}`;
      }

      console.log(`[App] Successfully fetched joke for ${userName}`);

      res.render('index', {
        joke: jokeText,
        userName: userName,
        error: null,
        jokeCategory: data.category
      });
    }
  } catch (error) {
    console.error('[App] Error fetching joke:', error.message);

    let errorMessage = 'Failed to fetch joke. Please try again.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. The API took too long to respond.';
    } else if (error.response) {
      errorMessage = `API Error: ${error.response.status}`;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Unable to connect to the joke API. Check your internet connection.';
    }

    res.render('index', {
      joke: null,
      userName: req.body.name || '',
      error: errorMessage
    });
  }
});

module.exports = router;
