import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { MdDeleteOutline, MdEditCalendar } from 'react-icons/md';

function Group({
  value,
  cnt,
  idx,
  handleSelect,
  clickGroup,
  id,
  menusRef,
  clickModify,
  clickDelete,
}) {
  const handleClick = useCallback(() => {
    handleSelect(idx);
    clickGroup(id);
  }, [idx, handleSelect, id, clickGroup]);

  const handleModify = useCallback(
    event => {
      event.stopPropagation();
      clickModify(id);
    },
    [clickModify, id],
  );

  const handleDelete = useCallback(
    event => {
      event.stopPropagation();
      clickDelete(id);
    },
    [clickDelete, id],
  );

  return (
    <Wrapper
      className="item group-list-group"
      onClick={handleClick}
      ref={el => {
        menusRef.current[idx] = el;
      }}
      data-gname={value}
      data-id={id}
    >
      {value}
      <Right>
        <span>{cnt}</span>
        <Icons>
          <MdDeleteOutline onClick={handleDelete} />
          <MdEditCalendar onClick={handleModify} />
        </Icons>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: pointer;
  width: 197px;
  height: 38px;
  padding-left: 37px;
  position: relative;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  :hover {
    font-weight: bold;
    div {
      visibility: visible;
    }
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 15px;
    width: 8px;
    height: 8px;
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

  :last-of-type:not(.selectedGroup) {
    :before {
      content: '';
      display: block;
      position: absolute;
      left: 18.5px;
      top: 0px;
      width: 1px;
      height: 50%;
      background: rgb(232, 238, 251);
    }
  }

  :last-of-type {
    :before {
      content: '';
      display: block;
      position: absolute;
      left: 18.5px;
      top: 0px;
      width: 1px;
      height: 50%;
      background: rgb(232, 238, 251);
    }
  }

  /* .item {
    :hover {
      background: rgb(232, 238, 251);
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 15px;
      width: 8px;
      height: 8px;
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
  } */
`;

const Right = styled.div`
  margin-right: 26px;
  display: flex;
  align-items: center;
`;

const Icons = styled.div`
  visibility: hidden;
  align-items: center;
  display: flex;
  align-items: center;
  svg {
    margin-left: 10px;
    font-size: 21px;
    :hover {
      fill: #e91e63;
    }
  }
`;

export default Group;
