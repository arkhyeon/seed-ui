import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { NavLink, useLocation } from 'react-router-dom';
import { MdMenu, MdReorder } from 'react-icons/all';
import CreateMenu from './CreateMenu';

/**
 * @param {Object} logoSetting
 *    @param {String|Component} logoSetting.logo 로고에 작성될 텍스트 또는 컴포넌트
 *    @param {String} [logoSetting.logoLink = "/"] 로고 클릭 시 이동할 URL 주소
 * @param {Object[]} menuList Header에 생성될 메뉴 리스트
 * @param {boolean} [useDepth = true] 상단 메뉴의 Depth 메뉴 on, off 기능
 * @param {number} userRole
 *  해당 메뉴의 사용 권한을 체크하여 메뉴 활성/비활성(display:block/none) 판단
 *  userRole(ulevel)이 menuRole보다 작다면 활성화
 *  userRole[1] > menuRole[3] >> 메뉴 활성화
 *  userRole[3] > menuRole[1] >> 메뉴 비활성
 *
 * @returns {JSX.Element} HeaderCreator
 */
function HeaderCreator({
  logoSetting,
  menuList,
  useDepth = true,
  userRole = 99,
  children = <div />,
}) {
  const { logo, logoLink = '/' } = logoSetting;

  return (
    <HeaderWrap>
      <NavLink to={logoLink}>{logo}</NavLink>
      <CreateMenu menus={menuList} useDepth={useDepth} userRole={userRole} />
      {children}
    </HeaderWrap>
  );
}

const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  position: relative;
  z-index: 10;
  background-color: black;

  & > a {
    display: flex;
    justify-content: center;
    color: white;
  }
`;

export default HeaderCreator;
