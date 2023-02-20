import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { IoIosArrowDown } from 'react-icons/all';
import { css } from '@emotion/react';

const getChild = (children, displayName) =>
  React.Children.map(children, child => (child.type.displayName === displayName ? child : null));

export default function Card({ width, height, allCollapse = false, setAllCollapse, children }) {
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    if (allCollapse === undefined) return;
    setCollapse(allCollapse);
  }, [allCollapse]);

  useEffect(() => {
    if (allCollapse === undefined) return;
    const cardLength = document.querySelectorAll('.card-wrapper').length;
    const collapseLength = document.querySelectorAll('.card-collapse').length;

    setAllCollapse(cardLength === collapseLength);
  }, [collapse, setAllCollapse]);

  const header = getChild(children, 'Header');
  const body = getChild(children, 'Body');
  const footer = getChild(children, 'Footer');

  return (
    <CardWrapper className="card-wrapper">
      <CardTitle>
        {header}
        <IoIosArrowDown
          onClick={() => {
            setCollapse(prevState => {
              return !prevState;
            });
          }}
        />
      </CardTitle>
      <CardMain
        className={(allCollapse || collapse) && 'card-collapse'}
        width={width}
        height={height}
      >
        {body}
        {!!footer.length && <CardAddition>{footer}</CardAddition>}
      </CardMain>
    </CardWrapper>
  );
}

function Header({ children }) {
  return <>{children}</>;
}

function Body({ children }) {
  return <>{children}</>;
}

function Footer({ children }) {
  return <>{children}</>;
}

Header.displayName = 'Header';
Card.Header = Header;

Body.displayName = 'Body';
Card.Body = Body;

Footer.displayName = 'Footer';
Card.Footer = Footer;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardTitle = styled.div`
  width: 94.6%;
  height: 50px;
  font-size: 15px;
  position: relative;
  background: linear-gradient(#606870, #343a40);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-weight: bold;
  padding: 0 15px;
  box-sizing: border-box;

  svg {
    font-size: 18px;
    margin-left: 15px;
    cursor: pointer;
  }
`;

const CardMain = styled.div`
  ${({ width, height }) => {
    return css`
      width: ${width}px;
      height: ${height}px;
    `;
  }};
  margin-top: -25px;
  padding: 35px 10px 10px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  box-shadow: rgba(20, 20, 20, 0.12) 0 0.25rem 0.375rem -0.0625rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s;

  &.card-collapse {
    height: 0;
    padding: 0 10px;
    border: 0 solid #e0e0e0;
    margin: 0;
  }
`;

const CardAddition = styled.div`
  width: 100%;
`;
