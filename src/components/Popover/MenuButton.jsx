import React from 'react';
import styled from '@emotion/styled';
import { WhiteButton } from '../Button/Button';
import Popover, { PopoverItem, PopoverTitle } from './Popover';

/**
 * MenuButton — 누르면 고를 목록을 띄우는 버튼. 항목이 1개면 목록 없이 바로 실행
 * 사용법·props: 플레이그라운드 /playground/MenuButton
 */
function MenuButton({
  label,
  options = [],
  onSelect,
  getKey = (opt, i) => opt?.key ?? i,
  getLabel = opt => opt?.label ?? opt,
  title,
  disabled = false,
  ButtonComponent = WhiteButton,
  placement = 'top-end',
}) {
  return (
    <Popover
      placement={placement}
      renderTrigger={({ toggle }) => (
        <ButtonComponent
          disabled={disabled}
          onClick={() => {
            if (disabled || options.length === 0) return;
            if (options.length === 1) onSelect(options[0], 0);
            else toggle();
          }}
        >
          {label}
        </ButtonComponent>
      )}
    >
      {({ close }) => (
        <List>
          {title && <ListTitle>{title}</ListTitle>}
          {options.map((opt, i) => (
            <PopoverItem
              key={getKey(opt, i)}
              type="button"
              onClick={() => {
                close();
                onSelect(opt, i);
              }}
            >
              {getLabel(opt, i)}
            </PopoverItem>
          ))}
        </List>
      )}
    </Popover>
  );
}

// 창 여백(12px)을 6px로 줄여 항목 hover 배경이 넓게 — 제목도 항목 글자와 줄 맞춤
const List = styled.div`
  max-height: 240px;
  overflow-y: auto;
  margin: -6px;
`;

const ListTitle = styled(PopoverTitle)`
  margin: 0;
  padding: 4px 10px 6px;
`;

export default MenuButton;
