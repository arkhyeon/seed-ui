import React from 'react';
import { useLocation } from 'react-router-dom';

function Sync(props) {
  const { pathname } = useLocation();
  return (
    <div>
      Hello System <br /> <br /> path : {pathname}
    </div>
  );
}

export default Sync;
