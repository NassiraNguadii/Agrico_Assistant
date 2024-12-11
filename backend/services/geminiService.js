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
                    {text: `You are AGRICO ASSISTANT, an expert agricultural advisor specializing in:
    
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
1. ANALYZE current weather conditions
2. COMPARE to optimal crop requirements
3. IDENTIFY risks and opportunities
4. PROVIDE specific recommendations
5. INCLUDE preventive measures

Special Instructions:
1. Always respond in Arabic
2. For disease detections, analyze both the disease and current weather impact
3. Provide practical treatment and prevention advice
4. Consider local weather conditions in recommendations

DISEASES DATABASE:
- Apple_scab (جرب التفاح)
- Black_rot (العفن الأسود)
- Cedar_apple_rust (صدأ التفاح السيدري)
- Powdery_mildew (البياض الدقيقي)
- Early_blight (اللفحة المبكرة)
- Late_blight (اللفحة المتأخرة)
- Leaf_spot (تبقع الأوراق)
- Bacterial_spot (التبقع البكتيري)
- Haunglongbing (اخضرار الحمضيات)
`}
                ]
            },
            {
                role: "model",
                parts: [
                    {text: "أفهم دوري كمساعد زراعي متخصص. سأقدم تحليلاً شاملاً ونصائح عملية باللغة العربية، مع مراعاة ظروف الطقس وحالة المحاصيل."}
                ]
            }
        ];
    },

    async sendMessage(userInput, weatherData) {
        try {
            if (!this.chat) {
                await this.initialize();
            }

            // Check if this is a disease detection message
            if (userInput.startsWith('DETECTED_DISEASE:')) {
                const [diseasePart, weatherPart] = userInput.split(',WEATHER:');
                const disease = diseasePart.replace('DETECTED_DISEASE:', '');
                const weather = JSON.parse(weatherPart);

                const analysisPrompt = `
تم الكشف عن حالة في النبات. تحليل الوضع كالتالي:

المرض المكتشف: ${disease}
الظروف الجوية الحالية:
- درجة الحرارة: ${weather.main.temp}°C
- الرطوبة: ${weather.main.humidity}%
- حالة الطقس: ${weather.weather[0].main}
- سرعة الرياح: ${weather.wind.speed} م/ث

قم بتقديم:
1. شرح المرض وخطورته
2. تأثير الظروف الجوية الحالية
3. خطوات العلاج المناسبة
4. إجراءات وقائية موصى بها`;

                const result = await this.chat.sendMessage(analysisPrompt);
                return result.response.text();
            }

            // Format regular chat messages with weather data if available
            const weatherInfo = weatherData ? `
الظروف الجوية الحالية:
درجة الحرارة: ${weatherData.main.temp}°C
الرطوبة: ${weatherData.main.humidity}%
الحالة: ${weatherData.weather[0].main}
سرعة الرياح: ${weatherData.wind.speed} متر/ثانية

استفسار المستخدم: ${userInput}` : userInput;

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