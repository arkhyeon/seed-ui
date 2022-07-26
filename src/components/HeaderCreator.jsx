import React, { useState } from 'react';
import CreateMenu from './CreateMenu.jsx';
import styled from '@emotion/styled';
import { NavLink, Outlet } from 'react-router-dom';
import { ConfigMenus } from '../assets/DepthMenuList';
import AsideCreator from './AsideCreator';

function HeaderCreator({ logoSetting, menuList, useDepth = true, menuStyle, children = <div /> }) {
  const { bgColor, bgHoverColor, fontColor, size, depthSize, headerColor, gap } = menuStyle;
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
          depthSize={depthSize}
          gap={gap}
        />
        {children}
      </HeaderWrap>
      <Outlet />
    </>
  );
}

const HeaderWrap = styled.div`
  width: calc(100% - 30px);
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
