import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import FloatInput from "./Components/FloatInput";
import CountableInput from "./Components/CountableInput";

function App() {

  const backendUrl = "http://localhost:8000";

  axios.create({withCredentials:true})
  axios.defaults.withCredentials = true

  const [predictions, setPredictions] = useState("No Predictions");
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
        <FloatInput
          feature= "time" name= "Time" 
          minVal= {0} maxVal= {730} stepSize = {.1} increment= {5}
          onValueCommitted={(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <CountableInput
          feature = "room" name= "Room"
          options= {["Room 0", "Room 1", "Room 2"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "accel_front" name= "Frontal Acceleration"
          minVal = {-2} maxVal = {2} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "accel_vert" name= "Vertical Acceleration"
          minVal = {-2} maxVal = {2} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "accel_lat" name= "Lateral Acceleration"
          minVal = {-2} maxVal = {2} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <CountableInput
          feature = "antenna" name= "Antenna ID"
          options = {["Antenna 1", "Antenna 2", "Antenna 3", "Antenna 4"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "rssi" name= "RSSI"
          minVal = {-1} maxVal = {0} stepSize = {.01} increment= {.05}onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "phase" name= "Phase"
          minVal = {0} maxVal = {6.5} stepSize = {.05} increment= {.1}onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "frequency" name= "Frequency"
          minVal = {900} maxVal = {930} stepSize = {1} increment= {5}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <CountableInput
          feature= "gender" name= "Gender"
          options= {["Female", "Male"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <CountableInput
          feature= "consecutiveness" name= "Consecutiveness"
          options= {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <CountableInput
          feature= "activity" name= "Activity Type"
          options= {["sitting on bed", "lying down", "ambulating", "sitting on chair"]}
          OnChoose= {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
        <FloatInput
          feature= "freq" name= "Frequency of Activity"
          minVal = {0} maxVal = {1} stepSize = {.01} increment= {.1}
          onValueCommitted = {(feature, value) => {
            updateInputs(feature, value);
          }}
        />
      </ul>
      <button onClick={() => {queryBackend()}}>Click to query backend</button>
      <p>Results: {predictions}</p>
    </div>
  );
}

export default App;
