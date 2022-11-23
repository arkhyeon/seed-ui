import React, { useCallback, useEffect, useState } from 'react';
import { MdLabel, MdLabelOutline } from 'react-icons/md';

function Label({ valueArr, setValueArr, value, LabelButton }) {
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = useCallback(() => {
    setIsCheck(!isCheck);

    if (isCheck) {
      setValueArr(valueArr.filter(el => el !== value));
    } else {
      setValueArr(valueArr.concat(value));
    }
  }, [isCheck, value, valueArr, setValueArr]);

  useEffect(() => {
    setIsCheck(valueArr.includes(value));
  }, [valueArr, value]);

  return (
    <LabelButton onClick={handleCheck} className="label-selector-option">
      {isCheck ? <MdLabel /> : <MdLabelOutline />}
      {value}
    </LabelButton>
  );
}

export default Label;
