import React from 'react';
import { useLocation } from 'react-router-dom';

function Project() {
  const { pathname } = useLocation();
  return (
    <div>
      Hello Sync <br /> <br /> path : {pathname}
    </div>
  );
}

export default Project;
