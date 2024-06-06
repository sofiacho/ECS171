# To run the backend
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# To run the model
import tensorflow as tf
from keras.models import load_model
import pandas as pd
#from keras.wrappers.scikit_learn import KerasClassifier

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


# Function needed to creat the model
def create_model(activation_function_hidden='relu', 
                 activation_function_output='sigmoid', 
                 hidden_units=2, 
                 hidden_layers=1, 
                 regularizer = tf.keras.regularizers.l2, 
                 reg_param = 0.01, 
                 momentum = 0.01, 
                 learning_rate = 0.001): 
    # TODO: implement our nueral network structure using SGD as the optimization technique (Martin)

    # REMOVE LATER: the code below is only for hyper parameter tuning. Eventually we want to pick 1 set of hyper parameters to use and use those for our final script.
    model = tf.keras.Sequential()
    # Input layer and first hidden layer
    model.add(tf.keras.layers.Dense(hidden_units, input_dim=14, activation=activation_function_hidden, 
                    kernel_regularizer = regularizer(reg_param)))
    
    # Additional hidden layers if specified
    for _ in range(hidden_layers - 1):
        model.add(tf.keras.layers.Dense(hidden_units, activation=activation_function_hidden, 
                        kernel_regularizer=regularizer(reg_param)))
    # Output layer
    model.add(tf.keras.layers.Dense(1, activation=activation_function_output))
    
    # compile the model using SGD as the optimizer and MSE as our loss function
    optimizer = tf.keras.optimizers.SGD(learning_rate=learning_rate, momentum=momentum)
    model.compile(loss='mean_squared_error', optimizer=optimizer, metrics=['accuracy'])
    return model

model = load_model('../../elderly_activity_model.h5')

class ModelInputs(BaseModel):
    time: float
    room: int
    accel_front: float
    accel_vert: float
    accel_lat: float
    antenna: int
    rssi: float
    phase: float
    frequency: float
    gender: int
    # consecutiveness: int
    # activity: int
    # freq: float
    acceleration: float

# this function normalizes inputs using z-score with pre-computed means and standard deviations
def z_standardize(inputs: ModelInputs):
  means = {
    'time': 299.08041575710786,
    'frontal accel': 0.714211430786125,
    'vertical accel': 0.3451994758398999,
    'lateral accel': -0.21747701003354275,
    'rssi': -58.277253487381536,
    'phase': 3.157278575107816,
    'frequency': 922.6705356192099,
    'acceleration': 1.0948324783556123,
  }

  stds = {
    'time': 257.5030020460596,
    'frontal accel': 0.40458496931471427,
    'vertical accel': 0.41904111439868014,
    'lateral accel': 0.4382190451534665,
    'rssi': 5.174082546628303,
    'phase': 2.182257002672122,
    'frequency': 1.679093166786223,
    'acceleration': 0.09598007669023396,
  }
  
  return {
    'time': [(inputs.time - means['time']) / stds['time']],
    'room': [inputs.room],
    'frontal accel': [(inputs.accel_front - means['accel_front']) / stds['accel_front']],
    'vertical accel': [(inputs.accel_vert - means['accel_vert']) / stds['accel_vert']],
    'lateral accel': [(inputs.accel_lat - means['accel_lat']) / stds['accel_lat']],
    'antenna id': [inputs.antenna],
    'rssi': [(inputs.rssi - means['rssi']) / stds['rssi']],
    'phase': [(inputs.phase - means['phase']) / stds['phase']],
    'frequency': [(inputs.frequency - means['frequency']) / stds['frequency']],
    'gender': [inputs.gender],
    # 'consecutiveness': [(inputs.consecutiveness - means['consecutiveness']) / stds['consecutiveness']],
    # 'activity': [inputs.activity],
    'acceleration': [(inputs.acceleration - means['acceleration']) / stds['acceleration']],
    # 'freq': [(inputs.freq - means['freq']) / stds['freq']],
  }

@app.put('/')
async def getPredictions(inputs: ModelInputs, request: Request):
  
  json_dat = await request.json()
  for key, value in json_dat.items():
    print(f"{key}: {value}")
  
  input_data = pd.DataFrame(z_standardize(inputs)).values
  
  predictions = model.predict(input_data)
  prediction = "Active" if predictions[0][0] >= 0.1784 else "Inactive"
  print(f"{predictions[0][0]} results in {prediction}")
  
  return {
    "prediction": prediction
  }