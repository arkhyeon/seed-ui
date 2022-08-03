import React from 'react';
import { useLocation } from 'react-router-dom';

function ConfigSync() {
  const { pathname } = useLocation();
  return (
    <div>
      Hello ConfigSync <br /> <br /> path: {pathname}
    </div>
  );
}

export default ConfigSync;
