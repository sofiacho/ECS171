import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import NumericInput from "./Components/NumericInput";
import SymbolicInput from "./Components/SymbolicInput";

function App() {

  const backendUrl = "http://localhost:8000";

  axios.create({withCredentials:true})
  axios.defaults.withCredentials = true

  const [predictions, setPredictions] = useState(null);
  const [inputs, setInputs] = useState({});
  const updateInputs = (feature, value) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [feature]: value,
    }));
  };

  function queryBackend()
  {
    const modelInputs = { ...inputs };

    // Calculate the acceleration magnitude
    const accel = Math.sqrt(
      Math.pow(inputs["accel_front"], 2) +
      Math.pow(inputs["accel_vert"], 2) +
      Math.pow(inputs["accel_lat"], 2)
    );

    modelInputs["acceleration"] = accel / Math.sqrt(3);

    axios.put(
      `${backendUrl}`,
      modelInputs,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      setPredictions(response.data.prediction)
    }).catch((error) => {
      setPredictions(error.message);
    })
  }

  return (
    <div className="App">
      <div></div>
      <ul>
        <NumericInput
          feature= "time" name= "Time" 
          minVal= {0} maxVal= {730} stepSize = {.1} increment= {5}
          onValueCommitted={(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <SymbolicInput
          feature = "room" name= "Room"
          options= {["Room 0", "Room 1", "Room 2"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "accel_front" name= "Frontal Acceleration"
          minVal = {-2} maxVal = {2} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "accel_vert" name= "Vertical Acceleration"
          minVal = {-2} maxVal = {2} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "accel_lat" name= "Lateral Acceleration"
          minVal = {-2} maxVal = {2} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <SymbolicInput
          feature = "antenna" name= "Antenna ID"
          options = {["Antenna 1", "Antenna 2", "Antenna 3", "Antenna 4"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "rssi" name= "RSSI"
          minVal = {-1} maxVal = {0} stepSize = {.01} increment= {.05}onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "phase" name= "Phase"
          minVal = {0} maxVal = {6.5} stepSize = {.05} increment= {.1}onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "frequency" name= "Frequency"
          minVal = {900} maxVal = {930} stepSize = {1} increment= {5}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <SymbolicInput
          feature= "gender" name= "Gender"
          options= {["Female", "Male"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        {/*
        <NumericInput
          feature= "consecutiveness" name= "Consecutiveness"
          minVal = {0} maxVal = {1000} stepSize = {1} increment= {10}
          onValueCommitted= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <SymbolicInput
          feature= "activity" name= "Activity Type"
          options= {["sitting on bed", "lying down", "ambulating", "sitting on chair"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <NumericInput
          feature= "freq" name= "Frequency of Activity"
          minVal = {0} maxVal = {1} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        */}
      </ul>
      <button onClick={() => {queryBackend()}}>Click to query backend</button>
      <p>
        {
          predictions ?
          (<span>Results: {
              <span style={{color: predictions == 'Active' ? 'green' : 'red'}}>{predictions}</span>
            }</span>) :
          (<span>Try submitting the inputs to see if the model thinks this person is active or inactive!</span>)
        }
      </p>
    </div>
  );
}

export default App;
