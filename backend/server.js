const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

let cache = null;

async function fetchHealthNews() {
    try {
        console.log('Fetching fresh data from MediaStack API...');
        const API_URL = 'https://api.mediastack.com/v1/news?access_key=79fef287dcd140781d68b4ab9796af71&categories=health&languages=en&limit=100';
        const response = await axios.get(API_URL);
        cache = response.data;  // Store data in cache
        return cache;
    } catch (error) {
        console.error('Error fetching health news:', error);
        throw new Error('Failed to fetch health news');
    }
}

// Single API endpoint with caching
app.get('/', async (req, res) => {
    if (cache) {
        return res.json(cache);
    }

    try {
        const data = await fetchHealthNews();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Keep the existing endpoint for backward compatibility
app.get('/health-news', async (req, res) => {
    if (cache) {
        return res.json(cache);
    }

    try {
        const data = await fetchHealthNews();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
