import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import EscStack from '../../common/EscStack';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP } from '../../common/floating';
import { DataListInput } from './InputComponent';

// ─── 검색형 매칭: 대소문자 무시 + 한글 초성 검색 ─────────────────────
const CHOSUNG = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const isHangulSyllable = code => code >= HANGUL_START && code <= HANGUL_END;
const getChosung = ch => {
  const code = ch.charCodeAt(0);
  return isHangulSyllable(code) ? CHOSUNG[Math.floor((code - HANGUL_START) / 588)] : ch;
};
// 받침을 뺀 글자 ('섭' → '서')
const stripJongsung = ch => {
  const code = ch.charCodeAt(0);
  if (!isHangulSyllable(code)) return ch;
  return String.fromCharCode(code - ((code - HANGUL_START) % 28));
};

/**
 * label 안에서 query와 맞는 첫 구간 [start, end) (글자 단위). 없으면 null.
 * - 검색어 글자가 자음(ㄱ~ㅎ)이면 label 글자의 초성과 비교 ('ㅅㅂ' → '서버', '서ㅂ' → '서버')
 * - 검색어 마지막 글자는 받침을 무시하고도 비교 (한글 조합 중 '서버'를 치다 '섭'이 되는 순간에도 목록 유지)
 */
export function matchLabel(label, query) {
  const chars = [...String(label ?? '')];
  const q = [...String(query).toLowerCase()];
  if (!q.length) return [0, 0];
  const last = q.length - 1;
  for (let start = 0; start + q.length <= chars.length; start += 1) {
    const ok = q.every((qc, j) => {
      const lc = chars[start + j].toLowerCase();
      if (lc === qc) return true;
      if (CHOSUNG.includes(qc)) return getChosung(lc) === qc;
      return j === last && stripJongsung(qc) !== qc && lc === stripJongsung(qc);
    });
    if (ok) return [start, start + q.length];
  }
  return null;
}

function HighlightedLabel({ label, range }) {
  if (!range || range[0] === range[1]) return label;
  const chars = [...String(label ?? '')];
  return (
    <>
      {chars.slice(0, range[0]).join('')}
      <DataListMark>{chars.slice(range[0], range[1]).join('')}</DataListMark>
      {chars.slice(range[1]).join('')}
    </>
  );
}

// labelList 기본값을 렌더마다 새 [] 로 만들면 dataMap·filteredList 가 매번 새로 계산돼
// 강조 위치 초기화 effect 가 방향키 누를 때마다 돌아 강조가 제자리로 돌아감 → 모듈 상수로 고정
const EMPTY_LABELS = [];

function DataList({
  id,
  valueList,
  labelList = EMPTY_LABELS,
  defaultValue,
  setData,
  select = false,
  emptyText = '검색 결과 없음',
  height = '400px',
  disabled = false,
  placeholder = '',
  listMinWidth,
}) {
  const ref = useRef();
  const dataListWrapRef = useRef();
  const [isListOpen, setListOpen] = useState(false);
  // 두 모드 모두 값은 목록에서 골라야만 바뀐다 (자유입력 없음).
  // - select: 입력칸 읽기전용, 목록을 보고 고름 (항목이 적은 고정 목록)
  // - 기본(검색형): 입력은 목록 거르기용 검색어. 검색어(query)가 null이면 선택된 값의 라벨을 보여 준다.
  const isSearchSelect = !select;
  const [query, setQuery] = useState(null);

  // 검색형 키보드 탐색: 포커스는 입력칸에 둔 채 강조 위치(activeIndex)만 옮긴다 (WAI-ARIA combobox 방식)
  // → 화살표로 내려가다가도 바로 이어서 타이핑할 수 있고, 강조는 항상 한 줄만 표시된다.
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useRef(`seed-datalist-${Math.random().toString(36).slice(2, 9)}`).current;

  // 목록이 닫히면(고름·바깥 클릭·Esc·포커스 이동) 입력한 검색어는 버리고 선택값 표시로 되돌린다
  useEffect(() => {
    if (!isListOpen) setQuery(null);
  }, [isListOpen]);

  // 드롭다운 목록 위치: Floating UI(포털+flip+입력너비 맞춤). overflow에 안 잘림.
  const { refs, floatingStyles } = useSeedFloating(isListOpen, {
    placement: 'bottom-start',
    gap: 2,
    matchWidth: true,
    clampHeight: false, // height prop(max-height)으로 높이 관리
    onReferenceDetached: () => setListOpen(false), // 입력칸이 DOM에서 빠지면 닫기
  });

  const dataMap = useMemo(() => {
    const map = new Map();
    valueList.forEach((v, i) => {
      map.set(v, labelList[i] === undefined ? v : labelList[i]);
    });
    return map;
  }, [valueList, labelList]);

  const displayValue = useMemo(
    () => (dataMap.has(defaultValue) ? dataMap.get(defaultValue) : ''),
    [defaultValue, dataMap],
  );

  const filteredList = useMemo(() => {
    const toItem = v => ({ value: v, label: dataMap.get(v) });
    if (!isSearchSelect || !query) return valueList.map(toItem);
    return valueList.reduce((acc, v) => {
      const range = matchLabel(dataMap.get(v), query);
      if (range) acc.push({ ...toItem(v), range });
      return acc;
    }, []);
  }, [valueList, dataMap, isSearchSelect, query]);

  // 강조 위치 초기화: 검색어가 있으면 첫 항목, 없으면 현재 선택 항목
  // 목록 '내용'이 바뀔 때만 다시 잡는다. 부모가 렌더마다 새 배열(valueList·labelList)을 넘겨도
  // 배열 참조만 바뀐 경우엔 초기화하지 않음 → 방향키로 옮긴 강조가 제자리로 돌아가지 않음
  const filteredListRef = useRef(filteredList);
  filteredListRef.current = filteredList;
  const filteredKey = useMemo(
    () => filteredList.map(d => `${typeof d.value}:${String(d.value)}`).join(''),
    [filteredList],
  );
  useEffect(() => {
    if (!isSearchSelect || !isListOpen) return;
    setActiveIndex(query ? 0 : filteredListRef.current.findIndex(d => d.value === defaultValue));
  }, [isSearchSelect, isListOpen, query, filteredKey, defaultValue]);

  // 강조 항목이 목록 밖으로 나가면 보이도록 스크롤
  useEffect(() => {
    if (!isSearchSelect || !isListOpen || activeIndex < 0) return;
    document.getElementById(`${listboxId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [isSearchSelect, isListOpen, activeIndex, listboxId]);

  // 검색형에서만 호출됨 (select는 읽기전용)
  const handleInputChange = e => {
    setQuery(e.target.value);
    setListOpen(true);
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
    // Tab 등 키보드로 포커스가 밖으로 나가도 닫기
    document.addEventListener('focusin', closeList);
    return () => {
      document.removeEventListener('mousedown', closeList);
      document.removeEventListener('focusin', closeList);
    };
  }, [closeList]);

  // Esc로 목록 닫기: 열려 있는 동안 EscStack에 등록.
  // EscStack이 document 캡처 단계에서 Esc를 먼저 가로채므로(모달 등), 여기 올려야 목록이 먼저 닫힘
  useLayoutEffect(() => {
    if (!isListOpen) return undefined;
    const handler = () => setListOpen(false);
    EscStack.push(handler);
    return () => EscStack.remove(handler);
  }, [isListOpen]);

  // 검색형 입력칸 키 처리: ↑↓ 강조 이동, Enter 선택 (한글 조합 중 키는 무시)
  const handleSearchKeyDown = e => {
    if (e.nativeEvent?.isComposing) return;
    const last = filteredList.length - 1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isListOpen) {
        setListOpen(true);
        return;
      }
      if (last < 0) return;
      const down = e.key === 'ArrowDown';
      setActiveIndex(i => {
        if (i < 0) return down ? 0 : last;
        if (down) return i >= last ? 0 : i + 1;
        return i <= 0 ? last : i - 1;
      });
    } else if (e.key === 'Home' || e.key === 'End') {
      if (!isListOpen || last < 0) return;
      e.preventDefault();
      setActiveIndex(e.key === 'Home' ? 0 : last);
    } else if (e.key === 'Enter') {
      // 목록이 닫혀 있으면 막지 않음 → 모달의 'Enter = 마지막 버튼' 등 바깥 동작이 그대로 동작
      if (!isListOpen) return;
      // 목록이 열려 있으면 고르는 중이므로 항상 막음 (걸러진 항목이 없어도 모달 저장이 눌리지 않게)
      e.preventDefault();
      if (filteredList[activeIndex]) handleItemClick(filteredList[activeIndex].value);
    }
    // Esc는 EscStack 핸들러가 처리, Tab은 focusin 감지로 닫힘
  };

  const arrowMove = useCallback(
    e => {
      const children = dataListWrapRef.current?.children;
      if (!children || !children.length || !isListOpen) return;

      const activeElement = document.activeElement;
      let focusIndex = Array.prototype.indexOf.call(children, activeElement);

      if (e.keyCode === 38) {
        e.preventDefault();
        focusIndex = focusIndex <= 0 ? children.length - 1 : focusIndex - 1;
        children[focusIndex].focus();
      } else if (e.keyCode === 40) {
        e.preventDefault();
        focusIndex = focusIndex >= children.length - 1 ? 0 : focusIndex + 1;
        children[focusIndex].focus();
      } else if (e.keyCode === 13) {
        if (activeElement && activeElement.hasAttribute('value')) {
          e.preventDefault();
          const attrValue = activeElement.getAttribute('value');
          // getAttribute는 항상 string → valueList에서 원본 타입으로 매칭
          const originalValue = valueList.find(v => String(v) === attrValue);
          handleItemClick(originalValue ?? attrValue);
        }
      }
      // Esc는 EscStack 핸들러(아래 useLayoutEffect)가 처리
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
          value={(isSearchSelect && query !== null ? query : displayValue) || ''}
          onChange={handleInputChange}
          autoComplete="off"
          onFocus={() => {
            setListOpen(true);
            // 검색형은 포커스 시 입력칸을 비워 바로 검색어를 칠 수 있게 하고, 현재 선택은 placeholder로 보여 준다
            if (isSearchSelect) setQuery('');
          }}
          onClick={() => {
            setListOpen(true);
            // 고른 뒤 포커스가 남은 채 다시 누른 경우도 검색어를 비우고 시작
            if (isSearchSelect && query === null) setQuery('');
          }}
          onKeyDown={isSearchSelect ? handleSearchKeyDown : arrowMove}
          readOnly={select}
          disabled={disabled}
          placeholder={(isSearchSelect && query !== null && displayValue) || placeholder}
          {...(isSearchSelect && {
            role: 'combobox',
            'aria-expanded': isListOpen,
            'aria-controls': listboxId,
            'aria-autocomplete': 'list',
            'aria-activedescendant':
              isListOpen && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined,
          })}
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
              style={{ ...floatingStyles, display: 'block', minWidth: listMinWidth }}
              {...(isSearchSelect && { id: listboxId, role: 'listbox' })}
            >
              {filteredList.map((data, i) =>
                isSearchSelect ? (
                  // 검색형: 항목은 포커스를 받지 않음(입력칸 유지). 마우스를 올리면 강조도 그 줄로 옮겨 한 줄만 강조
                  <DataListItem
                    key={data.value}
                    id={`${listboxId}-${i}`}
                    role="option"
                    aria-selected={data.value === defaultValue}
                    value={data.value}
                    $comboMode
                    className={i === activeIndex ? 'activeDataList' : undefined}
                    onMouseDown={e => e.preventDefault()}
                    onMouseMove={() => i !== activeIndex && setActiveIndex(i)}
                    onClick={() => handleItemClick(data.value)}
                  >
                    <HighlightedLabel label={data.label} range={data.range} />
                  </DataListItem>
                ) : (
                  <DataListItem
                    tabIndex={0}
                    key={data.value}
                    value={data.value}
                    aria-selected={data.value === defaultValue}
                    onClick={() => handleItemClick(data.value)}
                    onKeyDown={arrowMove}
                  >
                    {data.label}
                  </DataListItem>
                ),
              )}
              {isSearchSelect && !filteredList.length && <DataListEmpty>{emptyText}</DataListEmpty>}
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

  /* 목록 강조: 마우스·키보드 강조 = --seed-hover (seed-ui 목록 공통), 선택된 값 = --seed-header-bg */
  ${({ $comboMode }) =>
    $comboMode
      ? `
  &.activeDataList {
    background-color: var(--seed-hover);
  }`
      : `
  &:hover,
  &:focus {
    background-color: var(--seed-hover);
  }`}

  /* 선택된 값: 헤더 바와 같은 짙은 회색 바탕 + 흰 글씨 (라이트·다크 모두 어두운 바) */
  &[aria-selected='true'] {
    background-color: var(--seed-header-bg);
    color: var(--seed-invert-text);
  }
`;

// 검색어와 맞는 글자 표시: 배경 없이 굵게 + 강조색 한 가지
const DataListMark = styled.mark`
  background: none;
  color: var(--seed-primary);
  font-weight: 700;
  padding: 0;
`;

const DataListEmpty = styled.li`
  padding: 0.375rem 0.75rem;
  font-size: 13px;
  color: var(--seed-text-muted, #868e96);
  user-select: none;
`;

export default DataList;
