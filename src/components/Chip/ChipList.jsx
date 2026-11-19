import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Chip from './Chip';
import Popover from '../Popover/Popover';

/**
 * ChipList — 칩 묶음. max 개만 보여주고 나머지는 "+N ▾" 를 눌러 Popover 로 표시
 * 사용법·props: 플레이그라운드 /playground/ChipList
 *
 * @param {Array<string|object>} items  문자열 또는 { key?, label, ...Chip props }
 * @param {number}  [max]               보여줄 개수 (없으면 전부)
 * @param {boolean} [fit=false]         부모 너비에 들어가는 만큼만 보여줌 (max 와 같이 쓰면 작은 쪽, 부모 너비를 다 차지함)
 * @param {object}  [chipProps]         모든 칩 공통 props (size·shape·tone 등)
 * @param {string}  [popoverTitle]      넘친 목록 창 제목
 * @param {number|string} [popoverWidth] 넘친 목록 창 너비
 * @param {'nowrap'|'wrap'} [wrap='nowrap'] 보이는 칩 줄바꿈 여부 (fit 이면 무시)
 * @param {node}    [empty]             항목이 없을 때 표시
 */
function ChipList({
  items = [],
  max,
  fit = false,
  chipProps,
  popoverTitle,
  popoverWidth,
  popoverPlacement = 'bottom-start',
  wrap = 'nowrap',
  gap = 4,
  empty = null,
  className,
  style,
}) {
  const list = (items || []).map(toItem);
  const { boxRef, measureRef, count: fitCount } = useFitCount(fit, list, gap);
  if (!list.length) return empty;

  const maxLimit = typeof max === 'number' && max >= 0 ? max : list.length;
  const limit = fit && fitCount != null ? Math.min(maxLimit, fitCount) : maxLimit;
  const shown = list.slice(0, limit);
  const hidden = list.slice(limit);

  const renderChip = ({ key, label, ...own }, i) => (
    <Chip key={key ?? i} {...chipProps} {...own}>
      {label}
    </Chip>
  );

  const moreChip = (count, rest) => (
    <Chip
      size={chipProps?.size}
      shape={chipProps?.shape}
      tone="outline"
      onClick={() => {}}
      title={rest.map(h => (typeof h.label === 'string' ? h.label : '')).join(', ')}
    >
      +{count} ▾
    </Chip>
  );

  const chips = (
    <Wrap
      className={fit ? undefined : className}
      style={{ gap, flexWrap: fit ? 'nowrap' : wrap, ...(fit ? null : style) }}
    >
      {shown.map(renderChip)}
      {hidden.length > 0 && (
        <Popover
          title={popoverTitle}
          width={popoverWidth}
          placement={popoverPlacement}
          trigger={moreChip(hidden.length, hidden)}
        >
          {({ close }) => (
            <MoreList style={{ gap }}>
              {hidden.map((it, i) =>
                renderChip(
                  it.onClick
                    ? {
                        ...it,
                        onClick: e => {
                          it.onClick(e);
                          close();
                        },
                      }
                    : it,
                  i,
                ),
              )}
            </MoreList>
          )}
        </Popover>
      )}
    </Wrap>
  );

  if (!fit) return chips;

  // fit: 부모 너비를 차지하는 상자 + 칩 원래 너비를 재는 숨은 줄
  return (
    <FitBox ref={boxRef} className={className} style={style}>
      {chips}
      <Measure ref={measureRef} style={{ gap }} aria-hidden="true" inert>
        {list.map(renderChip)}
        {/* "+N" 너비는 가장 긴 경우(전체 개수)로 잼 */}
        {moreChip(list.length, [])}
      </Measure>
    </FitBox>
  );
}

/** fit - 상자 너비 안에 "+N" 자리까지 남기고 들어가는 칩 개수 (최소 1개, 그 칩이 넘치면 말줄임) */
function useFitCount(enabled, list, gap) {
  const boxRef = useRef(null);
  const measureRef = useRef(null);
  const [count, setCount] = useState(null);

  // 칩 내용이 바뀌면 다시 잼 (items 배열이 매번 새로 와도 내용이 같으면 그대로)
  const signature = enabled ? list.map(it => `${it.key ?? ''}:${it.label}`).join('\u0001') : '';

  useLayoutEffect(() => {
    if (!enabled) return undefined;
    const box = boxRef.current;
    const measure = measureRef.current;
    if (!box || !measure) return undefined;

    const calc = () => {
      const widths = [...measure.children].map(el => el.getBoundingClientRect().width);
      const moreWidth = widths.pop();
      const available = box.clientWidth;
      const n = widths.length;

      let used = 0;
      let fitted = 0;
      for (let i = 0; i < n; i += 1) {
        used += (i > 0 ? gap : 0) + widths[i];
        const rest = i < n - 1 ? gap + moreWidth : 0; // 뒤에 남는 칩이 있으면 "+N" 자리
        if (used + rest > available) break;
        fitted = i + 1;
      }
      setCount(n > 0 ? Math.max(1, fitted) : 0);
    };

    calc();
    // 부모 크기 변화 + 글꼴 로드 등으로 칩 너비가 바뀌는 경우
    const observer = new ResizeObserver(calc);
    observer.observe(box);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [enabled, signature, gap]);

  return { boxRef, measureRef, count };
}

const toItem = it => (it !== null && typeof it === 'object' ? it : { label: it });

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;

  /* 좁으면 보이는 칩부터 말줄임 ("+N" 은 Popover Wrap 이 flex-shrink:0 으로 유지) */
  & > .seed-chip {
    flex-shrink: 1;
  }
`;

const FitBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  /* 칩 너비가 부모 크기 계산에 끼지 않게 - 부모 너비만 따라감
     (없으면 InputGrid 처럼 칸 합이 넘치는 flex 행에서 내용 칸이 못 줄고 옆 칸만 줄어듦) */
  contain: inline-size;
  /* 숨은 측정 줄이 부모 스크롤을 만들지 않게 */
  overflow: hidden;
`;

const Measure = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: max-content;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;

  & > .seed-chip {
    flex-shrink: 0;
  }
`;

const MoreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 320px;
`;

export default ChipList;
