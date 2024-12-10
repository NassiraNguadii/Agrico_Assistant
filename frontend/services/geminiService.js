const geminiService = {
    async sendMessage(message) {
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput: message })
            });

            if (!response.ok) {
                throw new Error('Chat request failed');
            }

            const data = await response.json();
            console.log('Response from server:', data); // Debug log
            return data.response;
        } catch (error) {
            console.error('Error in chat service:', error);
            throw error;
        }
    }
};