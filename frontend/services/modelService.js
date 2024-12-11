const modelService = {
    async predictDisease(imageFile) {
        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Prediction failed');
            }

            const result = await response.json();
            console.log('Disease detection result:', result); // Debug log
            return {
                class_name: result.class_name,
                image: result.image,
                success: true
            };
        } catch (error) {
            console.error('Error in disease prediction:', error);
            throw error;
        }
    }
};