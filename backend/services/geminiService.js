const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const geminiService = {
    MODEL_NAME: "gemini-1.5-pro",
    API_KEY: process.env.API_KEY,
    genAI: null,
    chat: null,

    async initialize() {
        this.genAI = new GoogleGenerativeAI(this.API_KEY);
        const model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
        
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            }
        ];

        this.chat = await model.startChat({
            generationConfig,
            safetySettings,
            history: this.getInitialHistory()
        });
    },

    getInitialHistory() {
        return [
            {
                role: "user",
                parts: [
                    {text: `You are AGRICO ASSISTANT, an expert agricultural advisor who provides real-time weather-based guidance.
                    
IMPORTANT: I will provide you with current weather data in each query. Use this data to provide context-aware advice.

CORE CROPS AND THEIR OPTIMAL CONDITIONS:

APPLES:
- Optimal temp: 20-25°C
- Ideal humidity: 60-70%
- Risk conditions: High humidity (>75%) increases disease risk
- Frost sensitive during flowering

BELL PEPPERS:
- Optimal temp: 21-29°C
- Ideal humidity: 50-70%
- Risk conditions: Cold (<15°C) or very hot (>35°C)

BLUEBERRIES:
- Optimal temp: 15-20°C
- Required chill hours: 300-1000
- Risk conditions: High humidity leading to fungal issues

CHERRIES:
- Optimal temp: 18-24°C
- Required chill hours: 1000-1500
- Risk conditions: Late frosts, excessive rain during fruiting

CORN:
- Optimal temp: 21-30°C
- Water needs: 500-800mm during growing
- Risk conditions: Drought during pollination

GRAPES:
- Optimal temp: 15-30°C
- Prefers low humidity
- Risk conditions: High humidity (fungal diseases)

POTATOES:
- Optimal temp: 15-20°C
- Consistent moisture needed
- Risk conditions: Wet conditions (disease prone)

When responding:
1. ANALYZE the current weather data I provide
2. COMPARE it to the crop's optimal conditions
3. IDENTIFY any risks or opportunities
4. PROVIDE specific recommendations based on current conditions
5. INCLUDE preventive measures if conditions are unfavorable

Remember: Always use the current weather data I provide to give relevant, timely advice.`}
                ]
            },
            {
                role: "model",
                parts: [
                    {text: "I understand that I will receive real-time weather data with each query. I will analyze this data against optimal crop conditions to provide specific, weather-aware agricultural advice. Ready to assist with detailed recommendations based on current conditions."}
                ]
            }
        ];
    },

    async sendMessage(userInput, weatherData) {
        try {
            if (!this.chat) {
                await this.initialize();
            }

            // Format the input with weather data
            const weatherInfo = weatherData ? `
CURRENT WEATHER CONDITIONS:
Temperature: ${weatherData.main.temp}°C
Humidity: ${weatherData.main.humidity}%
Conditions: ${weatherData.weather[0].main}
Wind Speed: ${weatherData.wind.speed} m/s

Based on these current weather conditions, please advise about: ${userInput}` : userInput;

            const result = await this.chat.sendMessage(weatherInfo);
            return result.response.text();
        } catch (error) {
            console.error('Error in Gemini service:', error);
            throw error;
        }
    }
};

// For Node.js/Express environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = geminiService;
} 
// For browser environment
if (typeof window !== 'undefined') {
    window.geminiService = geminiService;
}