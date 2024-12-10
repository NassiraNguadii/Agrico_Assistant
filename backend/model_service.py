from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import torch
import torch.nn as nn
import torchvision.transforms.functional as TF
from PIL import Image
import io
import base64
import os

# Définition du modèle CNN
class CNN(nn.Module):
    def __init__(self, num_classes):
        super(CNN, self).__init__()
        self.conv_layers = nn.Sequential(
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(32),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(64),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.Conv2d(in_channels=128, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(128),
            nn.MaxPool2d(2),
            nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(256),
            nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.BatchNorm2d(256),
            nn.MaxPool2d(2),
        )
        
        self.dense_layers = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(50176, 1024),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(1024, num_classes),
        )

    def forward(self, x):
        out = self.conv_layers(x)
        out = out.view(-1, 50176)
        out = self.dense_layers(out)
        return out

# Dictionnaire de correspondance des classes
disease_classes = {
    0: 'Apple___Apple_scab',
    1: 'Apple___Black_rot',
    2: 'Apple___Cedar_apple_rust',
    3: 'Apple___healthy',
    4: 'Background_without_leaves',
    5: 'Blueberry___healthy',
    6: 'Cherry___Powdery_mildew',
    7: 'Cherry___healthy',
    8: 'Corn___Cercospora_leaf_spot Gray_leaf_spot',
    9: 'Corn___Common_rust',
    10: 'Corn___Northern_Leaf_Blight',
    11: 'Corn___healthy',
    12: 'Grape___Black_rot',
    13: 'Grape__Esca(Black_Measles)',
    14: 'Grape__Leaf_blight(Isariopsis_Leaf_Spot)',
    15: 'Grape___healthy',
    16: 'Orange__Haunglongbing(Citrus_greening)',
    17: 'Peach___Bacterial_spot',
    18: 'Peach___healthy',
    19: 'Pepper,bell__Bacterial_spot',
    20: 'Pepper,bell__healthy',
    21: 'Potato___Early_blight',
    22: 'Potato___Late_blight',
    23: 'Potato___healthy',
    24: 'Raspberry___healthy',
    25: 'Soybean___healthy',
    26: 'Squash___Powdery_mildew',
    27: 'Strawberry___Leaf_scorch',
    28: 'Strawberry___healthy',
    29: 'Tomato___Bacterial_spot',
    30: 'Tomato___Early_blight',
    31: 'Tomato___Late_blight',
    32: 'Tomato___Leaf_Mold',
    33: 'Tomato___Septoria_leaf_spot',
    34: 'Tomato___Spider_mites Two-spotted_spider_mite',
    35: 'Tomato___Target_Spot',
    36: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    37: 'Tomato___Tomato_mosaic_virus',
    38: 'Tomato___healthy'
}

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)  # Activation de CORS pour le frontend

# Chargement du modèle avec weights_only=True
def load_model():
    try:
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'best_model.pt')
        model = CNN(num_classes=39)
        model.load_state_dict(torch.load(model_path, 
                                       map_location=torch.device('cpu'),
                                       weights_only=True))
        model.eval()
        return model
    except Exception as e:
        print(f"Erreur lors du chargement du modèle: {str(e)}")
        raise

# Chargement du modèle une seule fois au démarrage
model = load_model()

def predict_image(image_data):
    try:
        # Convertir les données de l'image en objet PIL
        image = Image.open(io.BytesIO(image_data))
        image = image.resize((224, 224))
        input_data = TF.to_tensor(image)
        input_data = input_data.view((-1, 3, 224, 224))
        
        with torch.no_grad():
            output = model(input_data)
            _, predicted = torch.max(output.data, 1)
            
        return {
            'class_id': predicted.item(),
            'class_name': disease_classes[predicted.item()]
        }
    except Exception as e:
        print(f"Erreur lors de la prédiction: {str(e)}")
        raise

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400
    
    if file:
        try:
            image_data = file.read()
            result = predict_image(image_data)
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            result['image'] = f'data:image/jpeg;base64,{image_b64}'
            return jsonify(result)
        except Exception as e:
            print(f"Erreur dans la route predict: {str(e)}")
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)