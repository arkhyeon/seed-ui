import React from 'react';
import { useLocation } from 'react-router-dom';

function ConfigSyncTable(props) {
  const { pathname } = useLocation();
  return (
    <div>
      Hello ConfigSyncTable <br /> <br /> path : {pathname}
    </div>
  );
}

export default ConfigSyncTable;
