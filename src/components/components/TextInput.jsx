import React from 'react';

function TextInput(props) {
  return <input type="text" ref={props.inputref} {...props} />;
}

export default TextInput;
