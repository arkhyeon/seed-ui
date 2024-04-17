import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './Index';
import { DepthList1 } from './assets/DepthMenuList';
import { SetRoute } from './components';
import './index.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}>
          {SetRoute(DepthList1, 1)}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
