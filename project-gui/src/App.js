import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { CookiesProvider, useCookies } from "react-cookie";
import { io } from "socket.io-client";

function App() {

  const backendUrl = "http://localhost:5000";

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
      <button onClick={() => {queryBackend()}}>Click to query flask</button>
    </div>
  );
}

export default App;
