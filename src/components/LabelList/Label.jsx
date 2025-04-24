import React from 'react';
import { MdLabel, MdLabelOutline } from 'react-icons/md';

function Label({ setSelectedValueList, data, selectedValueList }) {
  const isChecked = selectedValueList.includes(data.value);

  const handleToggle = () => {
    if (isChecked) {
      setSelectedValueList(prev => prev.filter(val => val !== data.value));
    } else {
      setSelectedValueList(prev => [...prev, data.value]);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className="label-selector-option"
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px 15px' }}
    >
      {isChecked ? <MdLabel /> : <MdLabelOutline />}
      <span style={{ marginLeft: '8px' }}>{data.label}</span>
    </div>
  );
}

export default Label;
