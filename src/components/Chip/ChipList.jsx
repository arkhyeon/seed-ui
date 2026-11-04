import React from 'react';
import styled from '@emotion/styled';
import Chip from './Chip';
import Popover from '../Popover/Popover';

/**
 * ChipList — 칩 묶음. max 개만 보여주고 나머지는 "+N ▾" 를 눌러 Popover 로 표시
 * 사용법·props: 플레이그라운드 /playground/ChipList
 *
 * @param {Array<string|object>} items  문자열 또는 { key?, label, ...Chip props }
 * @param {number}  [max]               보여줄 개수 (없으면 전부)
 * @param {object}  [chipProps]         모든 칩 공통 props (size·shape·tone 등)
 * @param {string}  [popoverTitle]      넘친 목록 창 제목
 * @param {number|string} [popoverWidth] 넘친 목록 창 너비
 * @param {'nowrap'|'wrap'} [wrap='nowrap'] 보이는 칩 줄바꿈 여부
 * @param {node}    [empty]             항목이 없을 때 표시
 */
function ChipList({
  items = [],
  max,
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
  if (!list.length) return empty;

  const limit = typeof max === 'number' && max >= 0 ? max : list.length;
  const shown = list.slice(0, limit);
  const hidden = list.slice(limit);

  const renderChip = ({ key, label, ...own }, i) => (
    <Chip key={key ?? i} {...chipProps} {...own}>
      {label}
    </Chip>
  );

  return (
    <Wrap className={className} style={{ gap, flexWrap: wrap, ...style }}>
      {shown.map(renderChip)}
      {hidden.length > 0 && (
        <Popover
          title={popoverTitle}
          width={popoverWidth}
          placement={popoverPlacement}
          trigger={
            <Chip
              size={chipProps?.size}
              shape={chipProps?.shape}
              tone="outline"
              onClick={() => {}}
              title={hidden.map(h => (typeof h.label === 'string' ? h.label : '')).join(', ')}
            >
              +{hidden.length} ▾
            </Chip>
          }
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

const MoreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 320px;
`;

export default ChipList;
