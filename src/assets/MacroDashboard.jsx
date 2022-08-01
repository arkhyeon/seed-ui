import React from 'react';
import { useLocation } from 'react-router-dom';

function MacroDashboard() {
  const { pathname } = useLocation();
  return (
    <div>
      Hello MacroDashboard <br /> <br /> path : {pathname}
    </div>
  );
}

export default MacroDashboard;
