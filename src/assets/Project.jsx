import React, { useEffect, useState } from 'react';
import { DataList, Radio } from '../components';
import axios from 'axios';
import _ from 'lodash';
import { SwitchButton } from '../components/Button/Button';

function Project() {
  const data2 = [
    'Andi',
    'Stern',
    'Andrea',
    'Ezra',
    'Romy',
    'Shaw',
    'Derek',
    'Yvonne',
    'Nils',
    'Janeen',
  ];

  return (
    <div className="App">
      <SwitchButton />
    </div>
  );
}

export default Project;

const columnDefs = [
  {
    headerName: '',
    width: 85,
    valueGetter: `node.rowIndex + 1`,
    cellStyle: { textAlign: 'center' },
  },
  {
    field: 'test',
    flex: 2,
    headerName: '서버',
  },
];
