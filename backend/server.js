const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const geminiService = require('./services/geminiService');
const weatherService = require('./services/weatherService');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { userInput } = req.body;
        
        if (!userInput) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Get weather data
        let weatherData;
        try {
            weatherData = await weatherService.getWeatherByCity('London'); // Or use geolocation
        } catch (weatherError) {
            console.error('Weather fetch error:', weatherError);
        }

        // Send both user input and weather data to Gemini
        const response = await geminiService.sendMessage(userInput, weatherData);
        res.json({ response });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    geminiService.initialize().catch(console.error);
});