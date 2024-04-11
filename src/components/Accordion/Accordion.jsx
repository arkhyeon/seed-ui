import React from 'react';
import styled from '@emotion/styled';
import { IoIosArrowDown } from 'react-icons/io';

export function Accordion({ title, children, collapse, setCollapse }) {
  return (
    <AccordionWrap>
      <Header
        onClick={e => {
          if (e.target !== e.currentTarget) return;
          setCollapse(!collapse);
        }}
      >
        {title}
        <IconWrap onClick={() => setCollapse(!collapse)} collapse={collapse}>
          <IoIosArrowDown />
        </IconWrap>
      </Header>
      {collapse && children}
    </AccordionWrap>
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
`;

const IconWrap = styled.div`
  width: 100%;
  height: 40px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  & svg {
    transform: ${({ collapse }) => (collapse ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: 0.15s ease-in-out;
  }
`;
