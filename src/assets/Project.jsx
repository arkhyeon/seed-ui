import React, { useEffect, useState } from 'react';
import { DataList } from '../components';
import axios from 'axios';
import _ from 'lodash';

function Project() {
  const [state, setState] = useState(2);
  const [change, setChange] = useState(true);
  const [serverList, setServerList] = useState([]);
  const [data, setData] = useState({
    server: 2,
    encode: 4,
  });
  const [encode, setEncode] = useState(1);
  const setDataListData = value => {
    setState(value);
  };
  const data1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
  const data3 = ['a', 'b', 'c'];

  useEffect(() => {
    getServerList();
  }, []);

  const getServerList = () => {
    axios.get(`http://192.168.10.26:8686/CLM30/find/dbms`).then(res => {
      console.log(res);
      setServerList(res.data.data);
    });
  };

  const changeData = e => {
    const { name, value } = e.target || e;

    setData(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const changeState = () => {
    if (state === 1) {
      setState(2);
    } else if (state === 2) {
      setState(1);
    }
  };

  return (
    <div className="App">
      <button onClick={changeState}>디폴트밸류변경</button>
      <button
        onClick={() => {
          console.log(state);
        }}
      >
        현재밸류
      </button>
      <button
        onClick={() => {
          setChange(!change);
        }}
      >
        data change
      </button>
      <DataList
        id="프로젝트"
        valueList={change ? data1 : data3}
        labelList={change ? data2 : data3}
        setData={setDataListData}
        select
      />
      <DataList
        labelList={_.map(serverList, 'server_name')}
        valueList={_.map(serverList, 'serverid')}
        setData={value => {
          changeData({ name: 'server', value });
        }}
        select
        defaultValue={data.server}
      />
      <button
        onClick={() => {
          console.log(data);
        }}
      >
        data
      </button>
      <DataList
        valueList={[1, 2, 3, 4]}
        labelList={['true', 'UTF-8', 'EUC-KR', 'lover']}
        setData={value => {
          changeData({ name: 'encode', value });
        }}
        select
        defaultValue={data.encode}
      />
    </div>
  );
}

export default Project;
