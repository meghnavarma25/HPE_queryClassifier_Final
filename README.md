# Query Classification System

A sophisticated query classification system that leverages multiple machine learning models including ensemble methods, RoBERTa transformers, and ChatGPT API to classify text queries into predefined categories. The system features a modern web interface built with Next.js and a robust FastAPI backend.

## Features

- **Multi-Model Classification**: Choose from 4 different classification approaches:
  - **Default**: Hybrid approach combining Ensemble and RoBERTa with ChatGPT validation
  - **Ensemble**: Custom ensemble model with auxiliary features and sentence embeddings
  - **RoBERTa**: Fine-tuned transformer-based classification
  - **ChatGPT**: OpenAI GPT-4 powered classification

- **Query Categories**:
  - Aggregate/Time-Based
  - Factual
  - Global Sensing/Summary
  - Multi-Part
  - Reasoning/Inference

- **Modern UI**: Interactive web interface with animated components and model descriptions
- **Real-time Predictions**: Fast API responses with CORS support
- **Advanced Feature Engineering**: Custom auxiliary features including NER, POS tagging, and domain-specific patterns

## Tech Stack

### Backend
- **FastAPI**: High-performance web framework
- **PyTorch**: Deep learning framework
- **Transformers**: Hugging Face transformers library
- **Sentence Transformers**: Semantic embeddings
- **Scikit-learn**: Machine learning utilities
- **spaCy**: NLP processing
- **OpenAI API**: GPT-4 integration

### Frontend
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Hooks**: State management

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- OpenAI API key

## Installation

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd query-classification-system
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install fastapi uvicorn torch transformers sentence-transformers
pip install scikit-learn joblib numpy scipy nltk spacy
pip install python-dotenv openai safetensors
```

4. **Download spaCy model**
```bash
python -m spacy download en_core_web_sm
```

5. **Download NLTK data**
```python
import nltk
nltk.download('punkt')
```

6. **Download Roberta Files**:
   

[➡️ Click here to download `model.safetensors`](https://drive.google.com/file/d/1z0HIoZcLitt6pGS3c2zoeTRKH3aM-1g0/view?usp=drive_link)

> Make sure the file is named exactly `model.safetensors`.

After downloading, move the file to your project’s backend folder:
```
your-project/  
├── backend/  
│ ├── main.py  
│ ├── model.safetensors ✅  
│ └── ...
``` 

7. **Environment Setup**
Create a `.env` file in the backend directory:
```env
API_KEY=your_openai_api_key_here
```

8. **Model Files**
Ensure you have the following model files in your backend directory:
- `HPE_multiclass_query_classifier.pkl` (Ensemble model)
- `label_encoder.pkl` (Label encoder)
- RoBERTa model files (tokenizer and model)

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend  # Adjust path as needed
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

## Running the Application

### Start the Backend

1. **Navigate to backend directory**
```bash
cd backend  # Adjust path as needed
```

2. **Run FastAPI server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Start the Frontend

1. **In a new terminal, navigate to frontend directory**
```bash
cd frontend  # Adjust path as needed
```

2. **Run Next.js development server**
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### POST `/classify`

Classifies a text query using the specified model.

**Request Body:**
```json
{
  "text": "What was HPE's revenue in Q4 2024?",
  "type": "default"  // Options: "default", "Ensemble", "Roberta", "Chatgpt"
}
```

**Response:**
```json
{
  "prediction": "Factual"
}
```

## Usage Examples

### Using the Web Interface

1. Open `http://localhost:3000`
2. Select a classification model
3. Enter your query in the text input
4. Click "Predict Class" to get the classification

### Using the API Directly

```python
import requests

response = requests.post(
    "http://localhost:8000/classify",
    json={
        "text": "Compare HPE's revenue growth from 2023 to 2024",
        "type": "Ensemble"
    }
)

result = response.json()
print(result["prediction"])  # Output: "Aggregate/Time-Based"
```

## Model Details

### Default Model
- Combines predictions from Ensemble and RoBERTa models
- Uses ChatGPT for validation when predictions differ
- Provides the most robust classification

### Ensemble Model
- Uses sentence embeddings (all-MiniLM-L6-v2)
- Incorporates 30+ auxiliary features including:
  - NER entities and POS tags
  - Domain-specific keywords
  - Temporal references
  - Question structure analysis
- Supports multi-class prediction with confidence thresholds

### RoBERTa Model
- Fine-tuned transformer model
- Direct text-to-label classification
- Fast inference with high accuracy

### ChatGPT Model
- Uses OpenAI's GPT-4 model
- Detailed prompt engineering for classification
- Provides explanations for classification decisions

## Configuration

### Model Parameters
- Uncertainty threshold: 1.0
- Probability difference threshold: 0.2
- Embedding model: all-MiniLM-L6-v2

### Environment Variables
- `API_KEY`: OpenAI API key for ChatGPT integration

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the FastAPI server is running on port 8000
2. **Model Loading Errors**: Verify all model files are present in the backend directory
3. **spaCy Model Error**: Run `python -m spacy download en_core_web_sm`
4. **OpenAI API Errors**: Check your API key in the `.env` file

### Dependencies Issues

If you encounter dependency conflicts:
```bash
pip install --upgrade transformers torch
pip install sentence-transformers --no-deps
pip install sentence-transformers
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Note**: Make sure to keep your OpenAI API key secure and never commit it to version control.
