## model_service.py
import torch
from torchvision import transforms
from PIL import Image
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class DiseaseDetectionService:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        # Load your model
        self.model = torch.load('path_to_your_model.pt', map_location=self.device)
        self.model.eval()
        
        # Define image transformations
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),  # Adjust size according to your model
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                              std=[0.229, 0.224, 0.225])
        ])

    def preprocess_image(self, image_bytes):
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        # Apply transformations
        return self.transform(image).unsqueeze(0)

    def predict(self, image_bytes):
        try:
            # Preprocess image
            input_tensor = self.preprocess_image(image_bytes)
            input_tensor = input_tensor.to(self.device)
            
            # Get prediction
            with torch.no_grad():
                output = self.model(input_tensor)
                
            # Process output (adjust based on your model's output format)
            probabilities = torch.nn.functional.softmax(output[0], dim=0)
            predicted_class = torch.argmax(probabilities).item()
            confidence = probabilities[predicted_class].item()
            
            return {
                'class': predicted_class,
                'confidence': confidence,
                'success': True
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }

# Initialize service
detection_service = DiseaseDetectionService()

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided', 'success': False})
    
    image_file = request.files['image']
    image_bytes = image_file.read()
    
    result = detection_service.predict(image_bytes)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)