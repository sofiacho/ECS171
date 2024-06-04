# To run the backend
from fastapi import FastAPI #, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

# To run the model
from tensorflow.keras.models import load_model

import numpy as np

class AppConfig:
  CORS_HEADERS = 'Content-Type'
  
  SECRET_KEY = "secret neural network key"  
  SESSION_TYPE = "filesystem"

app = FastAPI()
frontend_origin = "http://localhost:3000"
app.add_middleware(
  CORSMiddleware,
  allow_origins= frontend_origin,
  allow_credentials= True,
  allow_methods=["*"],
  allow_headers=["*"])

class ModelInputs(BaseModel):
  time: float
  room : int
  accel_front: float
  accel_vert: float
  accel_lat: float
  antenna: int
  rssi: float
  phase: float
  frequency: float
  gender: int
  consecutiveness: int
  activity: int
  acceleration: float
  freq: float
  

model = load_model('../../elderly_activity_model.h5')

@app.get('/')
def getPredictions(inputs: ModelInputs):
  
  return {
    "message": "Test"
  }