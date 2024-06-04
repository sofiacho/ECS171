import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { CookiesProvider, useCookies } from "react-cookie";

function App() {

  const backendUrl = "http://localhost:8000";

  axios.create({withCredentials:true})
  axios.defaults.withCredentials = true

  const [predictions, setPredictions] = useState("No Predictions")

  function queryBackend()
  {
    axios.get(`${backendUrl}`)
    .then((response) => {
      setPredictions(response.data.message)
    }).catch((error) => {
    })
  }

  return (
    <div className="App">
      <p>Results: {predictions}</p>
      <button onClick={() => {queryBackend()}}>Click to query backend</button>
    </div>
  );
}

export default App;
