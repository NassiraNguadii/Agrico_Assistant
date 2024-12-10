const { createApp } = Vue

createApp({
    data() {
        return {
            weather: null,
            loading: true,
            modelLoading: false,
            chatMessages: [],
            newMessage: '',
            selectedImage: null,
            prediction: null,
            error: null,
            // Dashboard data
            lastAnalysis: null,
            detectionCount: 0,
            recentActivities: []
        }
    },
    mounted() {
        this.getWeatherData();
        lucide.createIcons();
    },
    methods: {
        async getWeatherData() {
            try {
                // Using a default city instead of geolocation for demo
                const response = await weatherService.getWeatherByCity('London');
                this.weather = response;
                this.error = null;
            } catch (error) {
                console.error('Error fetching weather:', error);
                this.error = 'Failed to fetch weather data';
            } finally {
                this.loading = false;
            }
        },
        async sendMessage() {
            if (!this.newMessage.trim()) return;
            
            const userMessage = { type: 'user', content: this.newMessage };
            this.chatMessages.push(userMessage);
            
            try {
                const response = await geminiService.sendMessage(this.newMessage);
                this.chatMessages.push({ type: 'bot', content: response });
            } catch (error) {
                console.error('Error sending message:', error);
                this.chatMessages.push({ 
                    type: 'bot', 
                    content: 'Sorry, I encountered an error. Please try again.' 
                });
            }
            
            this.newMessage = '';
        },
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.modelLoading = true;
                this.error = null;
                
                try {
                    // Display the image
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.selectedImage = reader.result;
                    };
                    reader.readAsDataURL(file);

                    // Get prediction
                    const result = await modelService.predictDisease(file);
                    this.prediction = result;
                    
                    // Update dashboard data
                    this.lastAnalysis = new Date().toLocaleString();
                    this.detectionCount++;
                } catch (error) {
                    console.error('Error processing image:', error);
                    this.error = 'Failed to process image. Please try again.';
                    this.prediction = null;
                } finally {
                    this.modelLoading = false;
                }
            }
        }
    }
}).mount('#app')