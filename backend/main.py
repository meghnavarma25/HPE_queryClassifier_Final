from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
import sklearn
import joblib
import numpy as np
from safetensors import safe_open
import torch
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import sys
sys.path.append(os.path.dirname(__file__))
from ensemble import extract_auxiliary_features
import json
from cprompt import get_ai_response,ai_response

def get_embedder(model_name="all-MiniLM-L6-v2"):
    return SentenceTransformer(model_name)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

base_path =os.path.dirname(os.path.abspath(__file__))

roberta_model = pipeline("text-classification", model=base_path, tokenizer=base_path)

label_mapping = {
    "LABEL_0": "Aggregate/Time-Based",
    "LABEL_1": "Factual",
    "LABEL_2": "Global Sensing/Summary",
    "LABEL_3": "Multi-Part",
    "LABEL_4": "Reasoning/Inference"
}

def explain_prediction(
    text_query,
    model,
    embedder,
    aux_feature_fn,
    label_encoder,
    uncertainty_threshold=1.0,
    prob_diff_threshold=.2
):
    # === 1. Build Full Feature Vector ===
    embedding = embedder.encode([text_query])
    aux_features = np.array([aux_feature_fn(text_query)])
    X_input = np.hstack([embedding, aux_features])

    # === 2. Predict Probabilities ===
    probs = model.predict_proba(X_input)[0]  # returns [n_classes] shape

    # === 3. Decode Class Names ===
    class_names = label_encoder.classes_

    # === 4. Sort and Filter Top Predictions ===
    sorted_indices = np.argsort(probs)[::-1]
    top_prob = probs[sorted_indices[0]]

    predicted_classes = []
    for idx in sorted_indices:
        if top_prob - probs[idx] <= prob_diff_threshold:
            predicted_classes.append((class_names[idx], probs[idx]))
        else:
            break
    return [cls for cls, _ in predicted_classes]


model_path = os.path.join(base_path, "HPE_multiclass_query_classifier.pkl")
encoder_path = os.path.join(base_path, "label_encoder.pkl")
ensemble_model = joblib.load(model_path)
ensemble_label_encoder = joblib.load(encoder_path)
embedder = get_embedder()
aux_feature_fn = extract_auxiliary_features



class Query(BaseModel):
    text:str
    type:str
@app.post("/classify")
async def predict(q:Query):
    if q.type=="Ensemble":
        print("Ensemble Result")
        sendback=[str(x) for x in explain_prediction(q.text,ensemble_model,embedder=embedder,aux_feature_fn=aux_feature_fn,label_encoder=ensemble_label_encoder)]
    elif q.type=="Roberta":
        print("Roberta Result")
        sendback=label_mapping[roberta_model(q.text)[0]['label']]
    elif q.type=="Chatgpt":
        print("Chatgpt Result")
        sendback=ai_response(q.text)
        print(sendback)
    else:
        print("Default Result")
        result1=label_mapping[roberta_model(q.text)[0]['label']]
        result2=[str(x) for x in explain_prediction(q.text,ensemble_model,embedder=embedder,aux_feature_fn=aux_feature_fn,label_encoder=ensemble_label_encoder)]
        if result1 in result2:
            sendback=result1
        else:
            print(result1,result2,sep="_____")
            sendback=get_ai_response(q.text,result1,result2)
            print("gpt response: ",sendback)
    response = {
        "prediction":sendback
    }
    return response
