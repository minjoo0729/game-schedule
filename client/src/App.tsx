import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GamePage from "./pages/game";
import PageNotFound from "./pages/404";
import './App.css';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <GamePage/> }/>
          <Route path="*" element={ <PageNotFound/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
