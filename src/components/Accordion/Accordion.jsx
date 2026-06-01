import React from 'react';
import styled from '@emotion/styled';
import { IoIosArrowDown } from 'react-icons/io';

export function Accordion({ title, children, collapse, setCollapse }) {
  const handleToggle = () => {
    setCollapse(!collapse);
  };

  return (
    <AccordionWrap>
      <Header onClick={handleToggle}>
        {preventTitleClickToggle(title)}
        <IconWrap
          onClick={e => {
            e.stopPropagation();
            handleToggle();
          }}
          collapse={collapse}
        >
          <IoIosArrowDown />
        </IconWrap>
      </Header>
      {collapse && children}
    </AccordionWrap>
  );
}

function preventTitleClickToggle(node) {
  if (Array.isArray(node)) return React.Children.map(node, preventTitleClickToggle);
  if (!React.isValidElement(node)) return node;

  const children = React.Children.map(node.props.children, preventTitleClickToggle);

  if (!node.props.onClick) {
    return React.cloneElement(node, undefined, children);
  }

  return React.cloneElement(
    node,
    {
      onClick: e => {
        e.stopPropagation();
        node.props.onClick(e);
      },
    },
    children,
  );
}

const AccordionWrap = styled.div`
  width: 100%;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d2d2d2;
  cursor: pointer;
`;

const IconWrap = styled.div`
  width: 100%;
  height: 40px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  & svg {
    transform: ${({ collapse }) => (collapse ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: 0.15s ease-in-out;
  }
`;
