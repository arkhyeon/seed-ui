import React from 'react';
import { useLocation } from 'react-router-dom';
import { Accordion } from '../components/Accordion/Accordion';

function Sync() {
  const { pathname } = useLocation();
  return (
    <div>
      <Accordion title="타이틀">hi</Accordion>
    </div>
  );
}

export default Sync;
