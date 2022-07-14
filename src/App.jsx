import React from 'react';
import { DepthList1 } from './DepthMenuList.jsx';
import { SetRoute } from './CreateMenu.jsx';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './assets/index.css';
import Index from './Index.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}>
          {SetRoute(DepthList1, 0)}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
