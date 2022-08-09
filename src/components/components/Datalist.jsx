import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { MdKeyboardArrowDown } from 'react-icons/all';
import TextInput from './TextInput';

function Datalist({ id, valueList = [], labelList, setData }) {
  const ref = useRef();
  const dataListWrapRef = useRef();
  const dataList = labelList.map((label, i) => {
    return { value: valueList[i] || label, label };
  });
  const [dataListState, setDataListState] = useState(dataList);

  useEffect(() => {
    document.addEventListener('mousedown', () => {
      dataListWrapRef.current.style.display = 'none';
    });

    return () => {
      document.removeEventListener('mousedown', () => {
        dataListWrapRef.current.style.display = 'none';
      });
    };
  });

  const searchData = value => {
    setData(value);
    const searchList = dataList.filter(data => {
      return data.label.includes(value);
    });

    dataListWrapRef.current.style.display = 'block';

    if (searchList[0] === undefined) {
      dataListWrapRef.current.style.display = 'none';
    }

    if (searchList[0].label === value && searchList.length === 1) {
      dataListWrapRef.current.style.display = 'none';
    }

    console.log(searchList);
    console.log(searchList.length);
    console.log(searchList[0]);
    setDataListState(searchList);
  };

  const setTextData = value => {
    ref.current.value = value;
    searchData(value);
  };

  return (
    <>
      <label htmlFor={id}>{id} : </label>
      <TextInput title="hi" value="b" />
      <MdKeyboardArrowDown />
      <DataListWrap>
        <input
          id={id}
          ref={ref}
          type="text"
          onChange={e => searchData(e.target.value)}
          autoComplete="off"
          onFocus={() => {
            dataListWrapRef.current.style.display = 'block';
          }}
        />
        <DataListItemWrap ref={dataListWrapRef}>
          {dataListState.map(data => {
            return (
              <DataListItem
                key={data.value}
                value={data.value}
                onClick={() => setTextData(data.label)}
              >
                {data.label}
              </DataListItem>
            );
          })}
        </DataListItemWrap>
      </DataListWrap>
    </>
  );
}

const DataListWrap = styled.div`
  width: 100%;
  background-color: olivedrab;
`;

const DataListItemWrap = styled.ul`
  width: 100%;
  background-color: darkolivegreen;
`;

const DataListItem = styled.li`
  width: 100%;

  &:hover {
    background-color: hotpink;
  }
`;

export default Datalist;
