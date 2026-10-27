import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import useSeedFloating from '../../common/useSeedFloating';
import { FLOATING_PROP, clickedInsideFloating } from '../../common/floating';
import { TextInput } from '../InputComp/InputComponent';
import { PickerInputIcon, Wrapper, panelStyle, headerBand } from './dateComponents/PickerShared';

// 패널 안쪽 여백 / 직접 입력칸 / '시 · 분' 라벨 줄 높이 — 헤더 색띠 높이 계산용
const PANEL_PADDING = 12;
const INPUT_HEIGHT = 28;
const INPUT_GAP = 6;
const LABEL_HEIGHT = 26;
const LABEL_GAP = 8;
// 컬럼 한 칸 너비, 한 번에 보이는 줄 수
const COLUMN_WIDTH = 48;
const VISIBLE_ROWS = 6;
const ROW_GAP = 2;

const pad = n => String(n).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => pad(i));

// 'HH:mm' → ['HH', 'mm'] (형식이 아니면 00:00)
const splitTime = time => {
  const m = /^(\d{1,2}):(\d{1,2})$/.exec(time ?? '');
  if (!m) return ['00', '00'];
  return [pad(Math.min(+m[1], 23)), pad(Math.min(+m[2], 59))];
};

// 직접 입력 → 'HH:mm' (24시간제). 해석 못 하면 null
// '9' '09' '947' '0947' '1430' '9:47' '9 47' '9시 47분'
export const parseTimeText = text => {
  const nums = (text ?? '').match(/\d+/g);
  if (!nums || nums.length > 2) return null;

  let h;
  let m = 0;
  if (nums.length === 2) {
    [h, m] = nums.map(Number);
  } else if (nums[0].length <= 2) {
    h = +nums[0];
  } else if (nums[0].length <= 4) {
    h = +nums[0].slice(0, -2);
    m = +nums[0].slice(-2);
  } else {
    return null;
  }
  if (h > 23 || m > 59) return null;
  return `${pad(h)}:${pad(m)}`;
};

// 헤더 색띠 안 직접 입력칸 — 친 값은 아래 시·분 컬럼에 마킹, Enter로 확정
function QuickInput({ text, setText, invalid, onEnter, placeholder }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = e => {
    // 한글 조합 중 Enter는 무시(조합 끝난 뒤 한 번만 처리)
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    } else if (e.key === 'Escape' && text) {
      // 입력 중 Esc는 입력만 지우고 패널은 유지
      e.preventDefault();
      setText('');
    }
  };

  return (
    <Quick
      ref={inputRef}
      value={text}
      placeholder={placeholder}
      aria-label="시간 직접 입력"
      aria-invalid={invalid}
      $invalid={invalid}
      onChange={e => setText(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}

// 시 또는 분 한 컬럼 — 선택값이 맨 위로 오도록 스크롤
function TimeColumn({ items, value, onSelect, itemHeight, label }) {
  const listRef = useRef(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const list = listRef.current;
    const idx = items.indexOf(value);
    if (!list || idx < 0) return;
    list.scrollTo({
      top: idx * (itemHeight + ROW_GAP),
      behavior: first.current ? 'auto' : 'smooth',
    });
    first.current = false;
  }, [items, value, itemHeight]);

  return (
    <Column
      ref={listRef}
      role="listbox"
      aria-label={label}
      style={{ height: itemHeight * VISIBLE_ROWS + ROW_GAP * (VISIBLE_ROWS - 1) }}
      $itemHeight={itemHeight}
    >
      {items.map(item => {
        const selected = item === value;
        return (
          <Cell
            key={item}
            type="button"
            role="option"
            aria-selected={selected}
            $selected={selected}
            style={{ height: itemHeight }}
            onClick={() => onSelect(item)}
          >
            {item}
          </Cell>
        );
      })}
    </Column>
  );
}

function TimePicker({ time = '00:00', itemHeight = 32, onChange = () => {}, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(time);
  // 팝업 안 직접 입력 텍스트 — 해석되면 컬럼에 미리 표시만 하고 Enter/확인 때 확정
  const [typed, setTyped] = useState('');
  const wrapperRef = useRef(null);

  // 시간 선택 위치: Floating UI(포털+flip). 화면 하단/스크롤에서 안 잘림.
  const { refs, floatingStyles } = useSeedFloating(isOpen, {
    placement: 'bottom-start',
    gap: 6,
    clampHeight: false,
  });

  useEffect(() => {
    setInputValue(time);
  }, [time]);

  const draft = parseTimeText(typed);
  // 직접 입력칸 안내 문구 — 현재 값(없거나 형식이 틀리면 기본값 00:00)
  const currentTime = parseTimeText(inputValue) ?? '00:00';
  const [hour, minute] = splitTime(draft ?? inputValue);

  // 닫힐 때 입력 중이던 텍스트 버림
  useEffect(() => {
    if (!isOpen) setTyped('');
  }, [isOpen]);

  const change = useCallback(
    next => {
      setTyped('');
      setInputValue(next);
      onChange(next);
    },
    [onChange],
  );

  // 입력 중인 값이 있으면 확정하고 닫기 (해석 못 하는 값이면 고칠 수 있게 열어둠)
  const confirm = () => {
    if (typed.trim() && !draft) return;
    if (draft) change(draft);
    setIsOpen(false);
  };

  const setNow = () => {
    const now = new Date();
    change(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  };

  // 바깥 클릭 / Esc 로 닫기
  useEffect(() => {
    if (!isOpen) return undefined;
    const onDown = ({ target }) => {
      if (wrapperRef.current?.contains(target) || clickedInsideFloating(target)) return;
      setIsOpen(false);
    };
    const onKey = e => e.key === 'Escape' && !e.defaultPrevented && setIsOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <Wrapper
      ref={node => {
        wrapperRef.current = node;
        refs.setReference(node);
      }}
    >
      <TextInput
        value={inputValue === null ? '' : inputValue}
        readOnly
        disabled={disabled}
        onClick={() => setIsOpen(open => !open)}
      />
      <PickerInputIcon clock />
      {isOpen &&
        !disabled &&
        createPortal(
          <TimeWrap
            className="time-picker"
            ref={refs.setFloating}
            {...FLOATING_PROP}
            style={floatingStyles}
          >
            <QuickInput
              text={typed}
              placeholder={currentTime}
              setText={setTyped}
              invalid={!!typed.trim() && !draft}
              onEnter={confirm}
            />
            <Grid>
              <Label>시</Label>
              <Label>분</Label>
              <TimeColumn
                items={HOURS}
                value={hour}
                onSelect={h => change(`${h}:${minute}`)}
                itemHeight={itemHeight}
                label="시"
              />
              <TimeColumn
                items={MINUTES}
                value={minute}
                onSelect={m => change(`${hour}:${m}`)}
                itemHeight={itemHeight}
                label="분"
              />
            </Grid>
            <Footer>
              <GhostBtn type="button" onClick={setNow}>
                지금
              </GhostBtn>
              <ConfirmBtn type="button" onClick={confirm}>
                확인
              </ConfirmBtn>
            </Footer>
          </TimeWrap>,
          document.body,
        )}
    </Wrapper>
  );
}

// DatePicker와 같은 패널(둥근 모서리·그림자·popIn) + 상단 어두운 색띠
const TimeWrap = styled.div`
  ${panelStyle};
  ${headerBand(PANEL_PADDING, INPUT_HEIGHT + INPUT_GAP + LABEL_HEIGHT)};
  padding: ${PANEL_PADDING}px;
`;

// 라벨과 컬럼이 같은 그리드 칸을 써서 세로로 정확히 정렬됨
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, ${COLUMN_WIDTH}px);
  column-gap: 4px;
`;

const Label = styled.div`
  height: ${LABEL_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${LABEL_GAP}px;
  font-size: 12px;
  font-weight: 500;
  color: var(--seed-invert-text);
  opacity: 0.6;
`;

// 어두운 헤더 위 입력칸 — DatePicker 연/월 셀렉트와 같은 반투명 톤
const Quick = styled.input`
  all: unset;
  box-sizing: border-box;
  display: block;
  /* input 기본 너비(size=20)가 패널 너비를 늘리지 않도록 — 컬럼 너비에 맞춤 */
  width: 0;
  min-width: 100%;
  height: ${INPUT_HEIGHT}px;
  margin-bottom: ${INPUT_GAP}px;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--seed-invert-text);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  transition: background-color 0.15s;

  &::placeholder {
    color: var(--seed-invert-text);
    opacity: 0.45;
  }
  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.16);
  }

  ${({ $invalid }) =>
    $invalid &&
    css`
      box-shadow: inset 0 0 0 1px var(--seed-primary);
    `}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${ROW_GAP}px;
  padding: 0 2px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  /* 마지막 값도 맨 위까지 올라올 수 있도록 아래 여백 */
  ${({ $itemHeight }) => css`
    &::after {
      content: '';
      flex: 0 0 ${($itemHeight + ROW_GAP) * (VISIBLE_ROWS - 1) - ROW_GAP}px;
    }
  `}
`;

const Cell = styled.button`
  all: unset;
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  scroll-snap-align: start;
  cursor: pointer;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--seed-text);
  transition: background-color 0.12s, color 0.12s;

  &:hover {
    background-color: var(--seed-hover);
  }
  &:focus-visible {
    outline: 2px solid var(--seed-primary);
    outline-offset: -2px;
  }

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: var(--seed-primary) !important;
      color: var(--seed-invert-text);
      font-weight: 600;
      box-shadow: 0 4px 10px -3px var(--seed-primary);
    `}
`;

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--seed-border);
`;

const footerBtn = css`
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.12s;
`;

// DatePicker 하단 ± 버튼과 같은 테두리 톤
const GhostBtn = styled.button`
  ${footerBtn};
  border: 1px solid var(--seed-border);
  color: var(--seed-text-secondary);
  &:hover {
    background: var(--seed-hover);
  }
`;

// RangeDatePicker 적용 버튼과 같은 검정 톤
const ConfirmBtn = styled.button`
  ${footerBtn};
  background: var(--seed-btn-primary-bg);
  color: var(--seed-btn-primary-text);
  &:hover {
    background: var(--seed-btn-primary-hover);
  }
`;

export default TimePicker;
