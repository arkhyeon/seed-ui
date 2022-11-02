import React, { useCallback, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { MdDeleteOutline, MdEditCalendar } from 'react-icons/md';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

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
  selected,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      menusRef.current[idx].classList.add('isOpenGroup');
    } else {
      menusRef.current[idx].classList.remove('isOpenGroup');
    }
  }, [isOpen, idx, menusRef]);

  useEffect(() => {
    if (selected !== idx) {
      setIsOpen(false);
    }
  }, [selected, idx]);

  const handleMouseOver = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (selected !== idx) {
      setIsOpen(false);
    }
  }, [selected, idx]);

  const handleClick = useCallback(() => {
    if (labelIcons.length !== 0) {
      return;
    }

    handleSelect(idx);
    clickGroup(id);
  }, [idx, handleSelect, id, clickGroup, labelIcons]);

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
    (e, iconIdx) => {
      e.stopPropagation();
      clickLabelIcon(id, iconIdx);
      handleSelect(idx);
    },
    [clickLabelIcon, id, handleSelect, idx],
  );

  const renderOpenIcon = useCallback(() => {
    if (isOpen) {
      return <AiOutlineUp />;
    }
    return <AiOutlineDown />;
  }, [isOpen]);

  const renderIcons = useCallback(() => {
    if (labelIcons.length === 0) {
      return null;
    }
    return (
      <LabelIcons>
        {labelIcons.map((el, idx) => (
          <LabelIcon type="button" key={`icon-${idx}`} onClick={e => handleIcon(e, idx)}>
            {el}
          </LabelIcon>
        ))}
      </LabelIcons>
    );
  }, [labelIcons, handleIcon]);

  return (
    <Wrapper
      className="item group-list-group"
      onClick={handleClick}
      ref={el => {
        menusRef.current[idx] = el;
      }}
      data-gname={value}
      data-id={id}
      isIcon={labelIcons.length !== 0}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <Line isIcon={labelIcons.length !== 0}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div>{value}</div>
            <Right isIcon={labelIcons.length !== 0}>
              <span>{cnt}</span>
              <Icons>
                <MdDeleteOutline onClick={handleDelete} />
                <MdEditCalendar onClick={handleModify} />
              </Icons>
            </Right>
          </div>
          {labelIcons.length !== 0 ? renderOpenIcon() : null}
        </div>
      </Line>
      {isOpen ? renderIcons() : null}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: ${({ isIcon }) => {
    if (!isIcon) {
      return 'pointer';
    }
    return 'normal';
  }};
  overflow: hidden;

  min-height: 38px;

  padding-left: ${({ isIcon }) => {
    if (!isIcon) {
      return '37px';
    }
    return 0;
  }};

  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  &:hover {
    svg {
      visibility: visible;
    }
  }

  ${({ isIcon }) => {
    if (!isIcon) {
      return css`
        width: 197px;
        :hover {
          font-weight: bold;
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
      `;
    }
    return css`
      margin-bottom: 10px;
    `;
  }}

  .item {
    :hover {
      background: rgb(232, 238, 251);
    }
  }
`;

const Right = styled.div`
  margin-right: ${({ isIcon }) => {
    if (!isIcon) {
      return '26px';
    }
    return 0;
  }};
  display: flex;
  align-items: center;
`;

const Icons = styled.div`
  align-items: center;
  display: flex;
  visibility: hidden;
  svg {
    :hover {
      fill: #e91e63;
    }
  }
`;

const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0px;

  svg {
    margin-left: 10px;
    font-size: 21px;
  }

  ${({ isIcon }) => {
    if (!isIcon) {
      return css`
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
    }
    return css`
      height: 38px;
    `;
  }};
`;

const LabelIcon = styled.button`
  cursor: pointer;
  background: white;
  border: 1px solid #d2d2d2;
  margin-right: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  svg {
    margin-left: 0;
    width: 20px;
    height: 20px;
  }
`;

const LabelIcons = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background: white;
  height: 38px;
`;

export default Group;
