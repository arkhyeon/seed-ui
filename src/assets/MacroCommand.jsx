import React from 'react';
import { useLocation } from 'react-router-dom';

function MacroCommand(props) {
  const { pathname } = useLocation();
  return (
    <div>
      Hello MacroCommand <br /> <br /> path : {pathname}
    </div>
  );
}

export default MacroCommand;
