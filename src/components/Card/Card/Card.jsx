import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { IoIosArrowDown } from 'react-icons/io';
import { css } from '@emotion/react';

export default function Card({
  width,
  height,
  allCollapse,
  isAllCollapse,
  setIsAllCollapse,
  children,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsAllCollapse(allCollapse);
  }, [isCollapsed]);

  useEffect(() => {
    const cardLength = document.querySelectorAll('.card-wrapper').length;
    const collapseLength = document.querySelectorAll('.card-collapse').length;

    setIsAllCollapse(allCollapse);

    if (collapseLength !== cardLength) {
      setIsCollapsed(allCollapse);
    }
    if (allCollapse !== isAllCollapse) {
      setIsCollapsed(allCollapse);
    }
  }, [allCollapse]);

  const handleToggleCollapse = () => setIsCollapsed(prevState => !prevState);

  const getCommaChild = type => {
    return React.Children.toArray(children).find(child => child.type === type)?.props.children;
  };

  const header = getCommaChild(CardHeader);
  const body = getCommaChild(CardBody);
  const footer = getCommaChild(CardFooter);

  return (
    <CardWrapper className="card-wrapper">
      <CardHeader>
        {header}
        <IoIosArrowDown onClick={handleToggleCollapse} />
      </CardHeader>
      <CardBody className={isCollapsed ? 'card-collapse' : ''} width={width} height={height}>
        {body}
        {footer && <CardFooter>{footer}</CardFooter>}
      </CardBody>
    </CardWrapper>
  );
}

const CardHeader = styled.div`
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

const CardBody = styled.div`
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

const CardFooter = styled.div`
  width: 100%;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
