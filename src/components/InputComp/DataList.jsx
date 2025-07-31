import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { DataListInput } from './InputComponent';

function DataList({
  id,
  valueList,
  labelList = [],
  defaultValue,
  setData,
  select = false,
  height = '400px',
  disabled = false,
  placeholder = '',
}) {
  const ref = useRef();
  const dataListWrapRef = useRef();
  const [isListOpen, setListOpen] = useState(false);

  const dataMap = useMemo(() => {
    const map = new Map();
    valueList.forEach((v, i) => {
      map.set(v, labelList[i] === undefined ? v : labelList[i]);
    });
    return map;
  }, [valueList, labelList]);

  const displayValue = useMemo(() => {
    if (dataMap.has(defaultValue)) {
      return dataMap.get(defaultValue);
    }
    return select ? '' : defaultValue;
  }, [defaultValue, dataMap, select]);

  const filteredList = useMemo(() => {
    if (select || !defaultValue) {
      return valueList.map(v => ({ value: v, label: dataMap.get(v) }));
    }
    const lowerCaseValue = defaultValue.toString().toLowerCase();
    return valueList
      .filter(v => dataMap.get(v).toString().toLowerCase().includes(lowerCaseValue))
      .map(v => ({ value: v, label: dataMap.get(v) }));
  }, [defaultValue, valueList, dataMap, select]);

  const handleInputChange = e => {
    if (!select) {
      setData(e.target.value);
    }
  };

  const handleItemClick = useCallback(
    itemValue => {
      setData(itemValue);
      setListOpen(false);
    },
    [setData],
  );

  const closeList = useCallback(e => {
    if (!ref.current?.contains(e.target) && !dataListWrapRef.current?.contains(e.target)) {
      setListOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', closeList);
    return () => document.removeEventListener('mousedown', closeList);
  }, [closeList]);

  const arrowMove = useCallback(
    e => {
      const children = dataListWrapRef.current?.children;
      if (!children || !children.length || !isListOpen) return;

      const activeElement = document.activeElement;
      let activeIndex = Array.prototype.indexOf.call(children, activeElement);

      if (e.keyCode === 38) {
        // Up arrow
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? children.length - 1 : activeIndex - 1;
        children[activeIndex].focus();
      } else if (e.keyCode === 40) {
        // Down arrow
        e.preventDefault();
        activeIndex = activeIndex >= children.length - 1 ? 0 : activeIndex + 1;
        children[activeIndex].focus();
      } else if (e.keyCode === 13) {
        // Enter
        if (activeElement && activeElement.hasAttribute('value')) {
          e.preventDefault();
          handleItemClick(activeElement.getAttribute('value'));
        }
      } else if (e.keyCode === 27) {
        // Escape
        setListOpen(false);
      }
    },
    [isListOpen, handleItemClick],
  );

  return (
    <>
      <DataListWrap>
        <DataListInput
          id={id}
          ref={ref}
          type="text"
          value={displayValue || ''}
          onChange={handleInputChange}
          autoComplete="off"
          onFocus={() => setListOpen(true)}
          onKeyDown={arrowMove}
          readOnly={select}
          disabled={disabled}
          placeholder={placeholder}
        />
        {isListOpen && (
          <DataListItemWrap ref={dataListWrapRef} height={height} style={{ display: 'block' }}>
            {filteredList.map((data, i) => (
              <DataListItem
                tabIndex={0}
                key={data.value}
                value={data.value}
                onClick={() => handleItemClick(data.value)}
                onKeyDown={arrowMove}
              >
                {data.label}
              </DataListItem>
            ))}
          </DataListItemWrap>
        )}
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
  max-height: ${({ height }) => height};
  display: none;
  position: absolute;
  top: 99%;
  background: white;
  z-index: 9999;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  overflow-y: auto;

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
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;

  &:hover,
  &:focus,
  &.activeDataList {
    background-color: ${({ theme }) => theme.dataListStyle.hoverBackgroundColor};
    color: ${({ theme }) => theme.dataListStyle.hoverColor};
  }
`;

export default DataList;
