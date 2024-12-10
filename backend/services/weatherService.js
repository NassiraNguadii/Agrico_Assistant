const weatherService = {
    API_KEY: '211498c217e1db5ebd8682d63abb3eed',
    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',

    async getWeatherByCity(city = 'London') {
        try {
            const response = await fetch(
                `${this.BASE_URL}?q=${city}&appid=${this.API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Weather data fetch failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    },

    async getWeatherByCoords(latitude, longitude) {
        try {
            const response = await fetch(
                `${this.BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Weather data fetch failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }
};

module.exports = weatherService;