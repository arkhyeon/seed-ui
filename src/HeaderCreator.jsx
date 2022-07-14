import React from 'react';
import CreateMenu from './CreateMenu.jsx';
import { DepthList1 } from './DepthMenuList.jsx';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

function HeaderCreator({ logoSetting, menuList, useDepth = true, menuStyle, children }) {
  const { bgColor, bgHoverColor, fontColor, size, hoverSize, headerColor } = menuStyle;
  const { logo, logoLink = '/', logoColor = '#f1f4f5' } = logoSetting;
  return (
    <>
      <HeaderWrap headerColor={headerColor} logoColor={logoColor}>
        <NavLink to={logoLink}>{logo}</NavLink>
        <CreateMenu
          menus={menuList}
          useDepth={useDepth}
          bgColor={bgColor}
          bgHoverColor={bgHoverColor}
          fontColor={fontColor}
          size={size}
          hoverSize={hoverSize}
        />
        {children}
      </HeaderWrap>
    </>
  );
}

const HeaderWrap = styled.div`
  width: 100%;
  background: ${({ headerColor }) => headerColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  height: 50px;
  position: relative;
  z-index: 10;

  & > a {
    font-weight: bold;
    font-size: 27.5px;
    color: ${({ logoColor }) => logoColor};
    font-family: 'arial', serif;
  }
`;

export default HeaderCreator;
