import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP } from '../../common/floating';
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

  // 드롭다운 목록 위치: Floating UI(포털+flip+입력너비 맞춤). overflow에 안 잘림.
  const { refs, floatingStyles } = useSeedFloating(isListOpen, {
    placement: 'bottom-start',
    gap: 2,
    matchWidth: true,
    clampHeight: false, // height prop(max-height)으로 높이 관리
  });

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
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? children.length - 1 : activeIndex - 1;
        children[activeIndex].focus();
      } else if (e.keyCode === 40) {
        e.preventDefault();
        activeIndex = activeIndex >= children.length - 1 ? 0 : activeIndex + 1;
        children[activeIndex].focus();
      } else if (e.keyCode === 13) {
        if (activeElement && activeElement.hasAttribute('value')) {
          e.preventDefault();
          const attrValue = activeElement.getAttribute('value');
          // getAttribute는 항상 string → valueList에서 원본 타입으로 매칭
          const originalValue = valueList.find(v => String(v) === attrValue);
          handleItemClick(originalValue ?? attrValue);
        }
      } else if (e.keyCode === 27) {
        setListOpen(false);
      }
    },
    [isListOpen, handleItemClick, valueList],
  );

  return (
    <>
      <DataListWrap ref={refs.setReference}>
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
        {isListOpen &&
          createPortal(
            <DataListItemWrap
              ref={node => {
                dataListWrapRef.current = node;
                refs.setFloating(node);
              }}
              {...FLOATING_PROP}
              height={height}
              style={{ ...floatingStyles, display: 'block' }}
            >
              {filteredList.map(data => (
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
            </DataListItemWrap>,
            document.body,
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
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: ${({ height }) => height};
  background: var(--seed-surface);
  z-index: 10000;
  border: 1px solid var(--x-ced4da);
  border-radius: 0.25rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--seed-scrollbar-track);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--seed-scrollbar-thumb);
  }
`;

const DataListItem = styled.li`
  height: 16px;
  border-bottom: 1px solid var(--x-ced4da);
  outline: none;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  font-size: 14px;
  color: var(--seed-text);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none;

  &:hover,
  &:focus,
  &.activeDataList {
    background-color: ${({ theme }) => theme.dataListStyle?.hoverBackgroundColor || 'var(--seed-emphasis-bg)'};
    color: ${({ theme }) => theme.dataListStyle?.hoverColor || 'var(--seed-emphasis-text)'};
  }
`;

export default DataList;
