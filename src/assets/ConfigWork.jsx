import React from 'react';
import { useLocation } from 'react-router-dom';

function ConfigWork() {
  const { pathname } = useLocation();
  return (
    <div>
      Hello ConfigWork <br /> <br /> path : {pathname}
    </div>
  );
}

export default ConfigWork;
