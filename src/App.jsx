import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Index from "./Index.jsx";
import {DepthList1} from "./assets/DepthMenuList.jsx";
import {SetRoute} from "./components";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}>
          {SetRoute(DepthList1, 0)}
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
