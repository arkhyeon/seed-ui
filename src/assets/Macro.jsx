import React from 'react';
import { useLocation } from 'react-router-dom';

function Macro(props) {
  const { pathname } = useLocation();
  return (
    <div>
      Hello macro <br /> <br /> path : {pathname}
    </div>
  );
}

export default Macro;
