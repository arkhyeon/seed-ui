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
  clickLabelIcon,
  labelIcons,
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

  const handleIcon = useCallback(
    (e, idx) => {
      e.stopPropagation();
      clickLabelIcon(id, idx);
    },
    [clickLabelIcon, id],
  );

  const renderIcons = useCallback(() => {
    return (
      <Line>
        <LabelIcons>
          {labelIcons.map((el, idx) => (
            <LabelIcon type="button" key={`icon-${idx}`} onClick={e => handleIcon(e, idx)}>
              {el}
            </LabelIcon>
          ))}
        </LabelIcons>
      </Line>
    );
  }, [labelIcons, clickLabelIcon]);

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
      <Line>
        <div>{value}</div>
        <Right>
          <span>{cnt}</span>
          <Icons>
            <MdDeleteOutline onClick={handleDelete} />
            <MdEditCalendar onClick={handleModify} />
          </Icons>
        </Right>
      </Line>
      {labelIcons.length > 0 ? renderIcons() : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: pointer;
  width: 197px;
  min-height: 38px;
  padding-left: 37px;
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  svg {
    margin-left: 10px;
    font-size: 21px;
    :hover {
      fill: #e91e63;
    }
  }

  :hover {
    font-weight: bold;
    div {
      visibility: visible;
    }
  }

  :before {
    content: '';
    display: block;
    position: absolute;
    left: 13.5px;
    width: 1px;
    height: calc(100% + 10px);

    background: rgb(232, 238, 251);
  }

  :last-of-type {
    :before {
      content: '';
      display: block;
      position: absolute;
      left: 13.5px;
      width: 1px;
      height: 20px;

      background: rgb(232, 238, 251);
    }
  }

  .item {
    :hover {
      background: rgb(232, 238, 251);
    }
  }
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
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 197px;
  position: relative;
  padding: 0px;

  &:first-of-type {
    margin-top: 10px;
    &:after {
      content: '';
      display: block;
      position: absolute;
      margin-left: -27px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgb(232, 238, 251);
      top: 50%;
      transform: translate(0, -50%);
    }
  }
`;

const LabelIcon = styled.button`
  cursor: pointer;
  border: none;
  background: transparent;
  margin-right: 5px;

  svg {
    margin-left: 0;
  }
`;

const LabelIcons = styled.div`
  display: flex;
  align-items: center;
  visibility: hidden;
  margin-top: 5px;
`;

export default Group;
