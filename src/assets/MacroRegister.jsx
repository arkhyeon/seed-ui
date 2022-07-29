import React from 'react';
import { useLocation } from 'react-router-dom';

function MacroRegister(props) {
  const { pathname } = useLocation();
  return (
    <div>
      Hello MacroRegister <br /> <br /> path : {pathname}
    </div>
  );
}

export default MacroRegister;
