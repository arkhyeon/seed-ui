import React, { useCallback, useEffect, useState } from 'react';
import { MdLabel, MdLabelOutline } from 'react-icons/md';

function Label({ setSelectedValueList, data, LabelButton, selectedValueList }) {
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = useCallback(() => {
    setIsCheck(!isCheck);
    console.log(isCheck);
    console.log(selectedValueList);
    if (isCheck) {
      setSelectedValueList(prevState => {
        return prevState.filter(state => state !== data.value);
      });
    } else {
      setSelectedValueList([...selectedValueList, data.value]);
    }
  }, [selectedValueList, isCheck, data]);

  useEffect(() => {
    setIsCheck(selectedValueList.includes(data.value));
  }, [selectedValueList, data]);

  return (
    <LabelButton onClick={handleCheck} className="label-selector-option">
      {isCheck ? <MdLabel /> : <MdLabelOutline />}
      {data.label} : {data.value}
    </LabelButton>
  );
}

export default Label;
