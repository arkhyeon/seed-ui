import React from 'react';
import { useLocation } from 'react-router-dom';

function MacroCommandSetting() {
  const { pathname } = useLocation();
  return (
    <div>
      Hello MacroCommandSetting <br /> <br /> path : {pathname}
    </div>
  );
}

export default MacroCommandSetting;
