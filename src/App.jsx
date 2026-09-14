import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Playground from './playground/Playground';
import './index.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Playground />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/playground/:name" element={<Playground />} />
      </Routes>
    </Router>
  );
}

export default App;
