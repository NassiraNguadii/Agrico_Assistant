# AgroIntelligence – AI-Powered Plant Disease Detection & Agricultural Advisory System

Integrated agricultural assistance system combining deep learning-based plant disease 
detection with an intelligent chatbot for environmental monitoring and farming advice.

## Results

- **Test accuracy:** 88.38%
- **Training accuracy:** 90.88%
- **Validation accuracy:** 88.18%
- **Macro-average precision:** 0.87
- **Macro-average recall:** 0.86
- **Macro-average F1-score:** 0.86
- **Chatbot query response accuracy:** 89.5%
- **Environmental data integration success rate:** 96.3%
- **Average chatbot response time:** 1.2 seconds

## Features

- Real-time plant disease detection across 39 classes
- Weather-aware agricultural advisory chatbot
- Location-specific farming recommendations
- Mobile-first, user-friendly interface
- Four-layer architecture (UI, ML & AI, Application, Data)

## Dataset

- **Total samples:** 61,486 images
- **Training set:** 36,584 samples (59.5%)
- **Validation set:** 15,679 samples (25.5%)
- **Test set:** 9,223 samples (15%)
- **Disease classes:** 39

## Tech Stack

- **ML/AI:** PyTorch, CNN (custom architecture)
- **Chatbot:** Gemini AI, Prompt Engineering
- **Weather:** OpenWeatherMap API
- **Backend:** Flask, Python
- **Frontend:** React.js, HTML, CSS
- **Data:** NumPy, Pandas, Matplotlib

## Architecture

The system implements four primary layers:

1. **User Interface Layer** — Web/Mobile application, Camera module, Chat interface
2. **ML & AI Layer** — Disease detection pipeline, Gemini AI integration
3. **Application Layer** — Disease detection service, Weather service, Analytics engine
4. **Data Layer** — Image storage, Plant knowledge base, Weather cache

## Training Details

- **Framework:** PyTorch with custom PlantDiseaseMetrics class
- **Hardware:** CUDA-enabled GPU
- **Batch size:** 64
- **Epochs:** 5 with automated early stopping
- **Optimizer:** Adam with learning rate scheduling

### Training Progression

| Epoch | Train Loss | Train Acc | Val Loss | Val Acc |
|-------|-----------|-----------|----------|---------|
| 1 | 1.3856 | 64.63% | 1.4357 | 63.66% |
| 2 | 0.7765 | 77.25% | 0.8648 | 75.96% |
| 3 | 0.6017 | 81.75% | 0.6944 | 80.22% |
| 4 | 0.5609 | 83.95% | 0.6895 | 81.42% |
| 5 | 0.2959 | 90.88% | 0.4082 | 88.18% |

## Installation

```bash
git clone https://github.com/NassiraNguadii/Agrico_Assistant.git
cd Agrico_Assistant
pip install -r requirements.txt
```

## Backend

```bash
cd backend
python app.py
```

## Frontend

```bash
cd frontend
npm install
npm start
```

## Authors

Nassira Nguadi, Fatima Zahra Oubella, Mohammed Amine Hemmi, Taha Khouzaima  
AI Department, ENSAM Meknès, Morocco

## Publication

Academic paper under submission — AI-Powered Plant Disease Detection 
and Agricultural Advisory System.
