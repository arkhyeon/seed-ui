import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import DataListInput from './DataListInput';

function Datalist({ id, valueList, labelList = [], setData }) {
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

  const searchData = value => {
    setData(value);
    const searchList = dataList.filter(data => {
      return data.label.includes(value);
    });

    dataListWrapRef.current.style.display = 'block';

    if (searchList[0] === undefined) {
      dataListWrapRef.current.style.display = 'none';
      return;
    }

    if (searchList[0].label === value && searchList.length === 1) {
      dataListWrapRef.current.style.display = 'none';
      return;
    }

    setDataListState(searchList);
  };

  const setTextData = value => {
    ref.current.value = value;
    searchData(value);
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
        dataListWrapRef.current.children[dataListWrapRef.current.children.length - 1].classList.add(
          'activeDataList',
        );
        moveCount = dataListWrapRef.current.children.length - 1;
      } else {
        moveCount--;
        dataListWrapRef.current.children[moveCount]?.classList.add('activeDataList');
      }
    }

    // 아래
    if (e.keyCode === 40) {
      e.preventDefault();
      if (moveCount >= dataListWrapRef.current.children.length - 1) {
        dataListWrapRef.current.children[0].classList.add('activeDataList');
        moveCount = 0;
      } else {
        moveCount++;
        dataListWrapRef.current.children[moveCount]?.classList.add('activeDataList');
      }
    }

    if (e.keyCode === 13) {
      if (dataListWrapRef.current.children[moveCount]?.attributes.value.value === undefined) {
        return;
      }
      setTextData(dataListWrapRef.current.children[moveCount]?.attributes.value.value);
    }
  };

  return (
    <>
      <DataListWrap>
        <DataListInput
          id={id}
          inputref={ref}
          type="text"
          onChange={e => searchData(e.target.value)}
          autoComplete="off"
          onFocus={() => {
            dataListWrapRef.current.style.display = 'block';
          }}
          onKeyDown={e => {
            arrowMove(e);
          }}
        />
        <DataListItemWrap ref={dataListWrapRef}>
          {dataListState.map((data, i) => {
            return (
              <DataListItem
                tabIndex={i}
                key={data.value}
                value={data.value}
                onClick={() => setTextData(data.value)}
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
`;

const DataListItemWrap = styled.ul`
  width: 250px;
  display: none;
  position: absolute;
  background: white;
  z-index: 50;
`;

const DataListItem = styled.li`
  width: 250px;
  height: 24px;
  &:hover,
  &:focus,
  &.activeDataList {
    background-color: ${({ theme }) => theme.dataListStyle.hoverBackgroundColor};
  }
`;

export default Datalist;
