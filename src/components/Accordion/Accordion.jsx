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
        <TitleWrap>{preventTitleClickToggle(title)}</TitleWrap>
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
  color: var(--seed-text);
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--seed-border);
  cursor: pointer;
`;

const TitleWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

const IconWrap = styled.div`
  flex-shrink: 0;
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
