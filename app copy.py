from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "chrome-extension://ogbpbdoafnihdklpjmapkkoknbclajlb",
    "http://localhost:7860",
    "http://127.0.0.1:7860"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model('toxicity.keras')
vectorizer = tf.keras.layers.TextVectorization(max_tokens=200000, output_sequence_length=1800)
vectorizer.adapt([""])

class TextData(BaseModel):
    data: list

@app.get("/")
async def root():
    return {"message": "Hello, World"}

@app.post("/api/predict")
async def predict(data: TextData):
    try:
        vectorized_text = vectorizer(data.data)
        predictions = model.predict(vectorized_text)
        return {"predictions": predictions.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
