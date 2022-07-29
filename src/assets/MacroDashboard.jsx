import React from 'react';
import { useLocation } from 'react-router-dom';

function MacroDashboard(props) {
  const { pathname } = useLocation();
  return (
    <div>
      Hello MacroDashboard <br /> <br /> path : {pathname}
    </div>
  );
}

export default MacroDashboard;
