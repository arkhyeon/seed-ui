import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Chip — 둥근 이름표(칩·태그·뱃지) 공통 컴포넌트
 * 사용법·props: 플레이그라운드 /playground/Chip
 *
 * @param {'xs'|'sm'|'md'} [size='sm']   xs=10px 글자 / sm=11px / md=12px·높이 22px
 * @param {'pill'|'tag'}   [shape='pill'] pill=완전 둥근, tag=3~4px 각진
 * @param {'neutral'|'strong'|'outline'|'soft'} [tone='neutral']
 * @param {string}  [color]    soft·strong·outline 기준색 (CSS 색/변수)
 * @param {string}  [dot]      앞 8px 색 점
 * @param {node}    [icon]     앞 아이콘
 * @param {boolean} [active]   선택 상태 (strong 모양으로 표시)
 * @param {fn}      [onClick]  있으면 <button> 렌더 + hover/focus 스타일
 * @param {fn}      [onRemove] 있으면 뒤에 ✕ 버튼
 * @param {string}  [title]    툴팁 (기본: children 이 문자열이면 그 값). 넘치면 말줄임
 */
function Chip({
  size = 'sm',
  shape = 'pill',
  tone = 'neutral',
  color,
  dot,
  icon,
  active = false,
  onClick,
  onRemove,
  removeTitle = '삭제',
  title,
  className,
  style,
  children,
  ...rest
}) {
  const clickable = typeof onClick === 'function';
  const removable = typeof onRemove === 'function';
  const tip = title ?? (typeof children === 'string' ? children : undefined);
  const look = { $size: size, $shape: shape, $tone: active ? 'strong' : tone, $color: color };

  const body = (
    <>
      {dot && <Dot style={{ background: dot }} aria-hidden="true" />}
      {icon && <IconWrap aria-hidden="true">{icon}</IconWrap>}
      {children !== undefined && children !== null && children !== '' && <Text>{children}</Text>}
    </>
  );

  const removeBtn = removable && (
    <RemoveButton
      type="button"
      aria-label={removeTitle}
      title={removeTitle}
      onClick={e => {
        e.stopPropagation();
        onRemove(e);
      }}
    >
      <svg viewBox="0 0 12 12" width="1em" height="1em" aria-hidden="true">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </RemoveButton>
  );

  // 클릭 + 삭제 둘 다: button 중첩 불가 → 겉은 span, 본문만 button
  if (clickable && removable) {
    return (
      <Root
        {...look}
        {...rest}
        className={['seed-chip', className].filter(Boolean).join(' ')}
        style={style}
        data-clickable="true"
        data-active={active || undefined}
        title={tip}
      >
        <BodyButton type="button" aria-pressed={active || undefined} onClick={onClick}>
          {body}
        </BodyButton>
        {removeBtn}
      </Root>
    );
  }

  return (
    <Root
      as={clickable ? 'button' : 'span'}
      type={clickable ? 'button' : undefined}
      aria-pressed={clickable && active ? true : undefined}
      onClick={clickable ? onClick : undefined}
      {...look}
      {...rest}
      className={['seed-chip', className].filter(Boolean).join(' ')}
      style={style}
      data-clickable={clickable || undefined}
      data-active={active || undefined}
      title={tip}
    >
      {body}
      {removeBtn}
    </Root>
  );
}

// ─── 모양 표 ───

const SIZE = {
  xs: { font: 10, height: 16, padX: 5, gap: 3, tagRadius: 3 },
  sm: { font: 11, height: 18, padX: 7, gap: 4, tagRadius: 4 },
  md: { font: 12, height: 22, padX: 9, gap: 5, tagRadius: 4 },
};

// 색은 전부 테마 변수 / color prop 기준 (color-mix 로 연한 바탕·진한 글자)
const toneStyle = ({ $tone, $color }) => {
  switch ($tone) {
    case 'strong':
      return css`
        background: ${$color || 'var(--seed-chip-strong-bg)'};
        border-color: ${$color || 'var(--seed-chip-strong-bg)'};
        color: ${$color ? 'var(--seed-chip-on-color)' : 'var(--seed-chip-strong-text)'} !important;
      `;
    case 'outline':
      return css`
        background: transparent;
        border-color: ${$color || 'var(--seed-chip-outline-border)'};
        color: ${$color || 'var(--seed-chip-neutral-text)'} !important;
      `;
    case 'soft': {
      const c = $color || 'var(--seed-text-secondary)';
      return css`
        background: color-mix(in srgb, ${c} var(--seed-chip-soft-bg-mix), transparent);
        border-color: color-mix(in srgb, ${c} var(--seed-chip-soft-border-mix), transparent);
        color: color-mix(in srgb, ${c} var(--seed-chip-soft-text-mix), var(--seed-text)) !important;
      `;
    }
    default:
      return css`
        background: var(--seed-chip-neutral-bg);
        border-color: var(--seed-chip-neutral-bg);
        color: var(--seed-chip-neutral-text) !important;
      `;
  }
};

const LOOK_PROPS = ['$size', '$shape', '$tone', '$color'];

const Root = styled('span', {
  shouldForwardProp: p => p !== 'as' && !LOOK_PROPS.includes(p),
})`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  text-align: left;
  transition: background-color 0.12s, border-color 0.12s, filter 0.12s;

  ${({ $size }) => {
    const s = SIZE[$size] || SIZE.sm;
    return css`
      height: ${s.height}px;
      padding: 0 ${s.padX}px;
      gap: ${s.gap}px;
      font-size: ${s.font}px;
    `;
  }}
  border-radius: ${({ $shape, $size }) =>
    $shape === 'tag' ? `${(SIZE[$size] || SIZE.sm).tagRadius}px` : '999px'};

  ${toneStyle}

  &[data-clickable='true'] {
    cursor: pointer;
  }
  &[data-clickable='true']:hover {
    filter: brightness(var(--seed-chip-hover-brightness));
  }
  &:focus-visible,
  &:has(> button:focus-visible:not([aria-label])) {
    outline: 2px solid var(--seed-chip-focus);
    outline-offset: 1px;
  }
`;

// 본문 button (클릭+삭제 칩) — 겉 Root 모양 그대로 상속
const BodyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: inherit;
  min-width: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit !important;
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }
`;

const Text = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit !important;
`;

const Dot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
`;

const IconWrap = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: inherit !important;

  & > svg {
    width: 1.1em;
    height: 1.1em;
  }
`;

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 0 -2px 0 0;
  padding: 1px;
  border: none;
  border-radius: 50%;
  background: none;
  color: inherit !important;
  font-size: 1em;
  opacity: 0.6;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    opacity: 1;
    background: var(--seed-chip-remove-hover);
    outline: none;
  }
`;

export default Chip;
