import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { DataList } from '../components';

function ConfigSync() {
  const { pathname } = useLocation();
  const [searchInfo, setSearchInfo] = useState({
    server_name: '',
    owner: '',
    tbl_name: '',
    orderValue: 'update_dt',
    order: 'asc',
  });

  const [serverList, setServerList] = useState([]);

  useEffect(() => getServerList(), []);

  const getServerList = () => {
    axios.get('https://webhook.site/923f8824-0e8b-4857-a0ab-607fc21d1a09').then(res => {
      setServerList(res.data);
      console.log(res.data);
    });
  };

  const changeSearchInfo = useCallback(e => {
    const { name, value } = e.target || e;

    setSearchInfo(prevState => ({ ...prevState, [name]: value }));
  }, []);
  return (
    <div>
      <DataList
        setData={value => changeSearchInfo({ name: 'server_name', value })}
        valueList={serverList.map(sl => sl.server_name)}
        defaultValue={searchInfo.server_name}
      />
      Hello ConfigSync <br /> <br /> path: {pathname}
    </div>
  );
}

export default ConfigSync;
