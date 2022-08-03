import React from 'react';
import { useLocation } from 'react-router-dom';

function MacroCommandTest() {
  const { pathname } = useLocation();
  return (
    <div>
      Hello MacroCommandTest <br /> <br /> path : {pathname}
    </div>
  );
}

export default MacroCommandTest;
