const modelService = {
    async predictDisease(imageFile) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Prediction request failed');
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Prediction failed');
            }

            return result;
        } catch (error) {
            console.error('Error in disease prediction:', error);
            throw error;
        }
    }
};