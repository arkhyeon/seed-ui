import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { DataListInput } from './InputComponent';

function DataList({ id, valueList, labelList = [], setData, select = false, defaultValue = '' }) {
  const ref = useRef();
  const dataListWrapRef = useRef();
  const dataList = valueList.map((value, i) => {
    return { value, label: labelList[i] || value };
  });
  const [dataListState, setDataListState] = useState(dataList);

  useEffect(() => {
    document.addEventListener('mousedown', e => {
      exitDataList(e);
    });
    return () => {
      document.removeEventListener('mousedown', e => {
        exitDataList(e);
      });
    };
  }, []);

  useEffect(() => {
    setDataListState(dataList);
    if (defaultValue === '') {
      ref.current.value = labelList[0] || valueList[0];
      // setTextData(valueList[0], labelList[0] || valueList[0]);
    } else {
      for (let i = 0; i < valueList.length; i++) {
        if (valueList[i] === defaultValue) {
          ref.current.value = labelList[i] || defaultValue;
          // setTextData(defaultValue, labelList[i] || defaultValue);
        }
      }
    }
  }, [valueList]);

  const exitDataList = e => {
    if (
      dataListWrapRef.current === null ||
      dataListWrapRef.current.contains(e.target) ||
      ref.current.contains(e.target)
    ) {
      return;
    }
    dataListWrapRef.current.style.display = 'none';
  };

  const searchData = (value, label) => {
    setData(value);
    if (select) {
      return;
    }
    const searchList = dataList.filter(data => {
      const stringLabel = data.label.toString();
      return stringLabel.includes(label);
    });

    dataListWrapRef.current.style.display = 'block';

    if (searchList[0] === undefined) {
      dataListWrapRef.current.style.display = 'none';
      setDataListState([]);
      return;
    }

    if (searchList[0].label === value && searchList.length === 1) {
      dataListWrapRef.current.style.display = 'none';
      return;
    }

    setDataListState(searchList);
  };

  const setTextData = (value, label) => {
    ref.current.value = label;
    searchData(value, label);
    dataListWrapRef.current.style.display = 'none';
  };

  let moveCount = -1;

  const arrowMove = e => {
    for (let i = 0; i < dataListWrapRef.current.children.length; i++) {
      dataListWrapRef.current.children[i].classList.remove('activeDataList');
    }
    // 위
    if (e.keyCode === 38) {
      e.preventDefault();
      if (moveCount <= 0) {
        dataListWrapRef.current.children[dataListWrapRef.current.children.length - 1].focus();
        dataListWrapRef.current.children[dataListWrapRef.current.children.length - 1].classList.add(
          'activeDataList',
        );
        moveCount = dataListWrapRef.current.children.length - 1;
      } else {
        moveCount--;
        dataListWrapRef.current.children[moveCount].focus();
        dataListWrapRef.current.children[moveCount]?.classList.add('activeDataList');
      }
    }

    // 아래
    if (e.keyCode === 40) {
      e.preventDefault();
      if (moveCount >= dataListWrapRef.current.children.length - 1) {
        dataListWrapRef.current.children[0].focus();
        dataListWrapRef.current.children[0].classList.add('activeDataList');
        moveCount = 0;
      } else {
        moveCount++;
        dataListWrapRef.current.children[moveCount].focus();
        dataListWrapRef.current.children[moveCount]?.classList.add('activeDataList');
      }
    }

    if (e.keyCode === 13) {
      if (dataListWrapRef.current.children[moveCount]?.attributes.value.value === undefined) {
        return;
      }
      setTextData(
        dataListWrapRef.current.children[moveCount]?.attributes.value.value,
        dataListWrapRef.current.children[moveCount]?.attributes.value.ownerElement.innerText,
      );
    }
  };

  return (
    <>
      <DataListWrap>
        <DataListInput
          id={id}
          inputRef={ref}
          type="text"
          onChange={e => searchData(e.target.value, e.target.value)}
          autoComplete="off"
          onFocus={() => {
            dataListWrapRef.current.style.display = 'block';
          }}
          onKeyDown={e => {
            arrowMove(e);
          }}
          readOnly={select}
        />
        <DataListItemWrap ref={dataListWrapRef}>
          {dataListState.map((data, i) => {
            return (
              <DataListItem
                tabIndex={i}
                key={data.value}
                value={data.value}
                onClick={() => setTextData(data.value, data.label)}
                onKeyDown={e => {
                  arrowMove(e);
                }}
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
  position: relative;
  display: flex;
`;

const DataListItemWrap = styled.ul`
  width: 100%;
  max-height: 400px;
  display: none;
  position: absolute;
  top: 99%;
  background: white;
  z-index: 50;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #eeeeee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d3d3d3;
  }
`;

const DataListItem = styled.li`
  height: 16px;
  border-bottom: 1px solid #ced4da;
  outline: none;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  font-size: 14px;
  &:hover,
  &:focus,
  &.activeDataList {
    background-color: ${({ theme }) => theme.dataListStyle.hoverBackgroundColor};
    color: ${({ theme }) => theme.dataListStyle.hoverColor};
  }
`;

export default DataList;
