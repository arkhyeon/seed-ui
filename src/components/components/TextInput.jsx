import React from 'react';

function TextInput({ attribute }) {
  console.log(attribute);
  return <input type="text" {...attribute} />;
}

export default TextInput;
