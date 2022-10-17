import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { BsPencilSquare } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';

function Group({ value, cnt, idx, handleSelect, clickGroup, id, menusRef, unitType }) {
  const handleClick = useCallback(() => {
    handleSelect(idx);
    clickGroup(id);
  }, [idx, handleSelect, id, clickGroup]);

  return (
    <Wrapper
      className="item"
      onClick={handleClick}
      ref={el => {
        menusRef.current[idx] = el;
      }}
    >
      {value}
      <Right>
        <span>
          {cnt}
          {unitType}
        </span>
        <Icons>
          <BsPencilSquare />
          <RiDeleteBinLine />
        </Icons>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: pointer;
  width: calc(100% - 48px);
  padding-left: 32px;
  position: relative;
  line-height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;

  :hover {
    background: rgb(232, 238, 251);
    div {
      visibility: visible;
    }
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 16px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgb(232, 238, 251);
    top: 50%;
    transform: translate(0, -50%);
  }

  :before {
    content: '';
    display: block;
    position: absolute;
    left: 18.5px;
    width: 1px;
    height: 100%;
    background: rgb(232, 238, 251);
  }
  :last-of-type:not(.selected) {
    :before {
      content: '';
      display: block;
      position: absolute;
      left: 18.5px;
      width: 1px;
      height: 50%;
      background: rgb(232, 238, 251);
    }
  }

  .item {
    :hover {
      background: rgb(232, 238, 251);
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 36px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgb(232, 238, 251);
      top: 50%;
      transform: translate(0, -50%);
    }

    :before {
      content: '';
      display: block;
      position: absolute;
      left: 38.5px;
      width: 1px;
      height: 100%;
      background: rgb(232, 238, 251);
    }
    :last-of-type {
      :before {
        content: '';
        display: block;
        position: absolute;
        left: 38.5px;
        width: 1px;
        height: 50%;
        background: rgb(232, 238, 251);
      }
    }
  }
`;

const Right = styled.div`
  margin-right: 26px;
  display: flex;
`;

const Icons = styled.div`
  visibility: hidden;
  align-items: center;
  display: flex;
  align-items: center;
  svg {
    margin-left: 8px;
  }
`;

export default Group;
