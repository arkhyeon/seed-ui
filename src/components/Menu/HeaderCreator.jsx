import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import CreateMenu from './CreateMenu';

/**
 * @param {Object} logoSetting
 *    @param {String|Component} logoSetting.logo 로고에 작성될 텍스트 또는 컴포넌트
 *    @param {String} [logoSetting.logoLink = "/"] 로고 클릭 시 이동할 URL 주소
 * @param {Object[]} menuList Header에 생성될 메뉴 리스트
 * @param {boolean} [useDepth = true] 상단 메뉴의 Depth 메뉴 on, off 기능
 * @param children
 *
 * @returns {JSX.Element} HeaderCreator
 */
function HeaderCreator({ logoSetting, menuList, useDepth = true, children = <div />, role = 'n' }) {
  const { logo, logoLink = '/' } = logoSetting;

  return (
    <HeaderWrap>
      <NavLink to={logoLink}>{logo}</NavLink>
      <CreateMenu menus={menuList} useDepth={useDepth} role={role} />
      {children}
    </HeaderWrap>
  );
}

const HeaderWrap = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  background-color: #3e3e3e;

  & > a {
    display: flex;
    justify-content: center;
    color: white;
  }
`;

export default HeaderCreator;
