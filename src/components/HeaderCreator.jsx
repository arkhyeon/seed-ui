import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import CreateMenu from './CreateMenu';

/**
 * @param {Object} logoSetting
 *    @param {String|Component} logoSetting.logo 로고에 작성될 텍스트 또는 컴포넌트
 *    @param {String} [logoSetting.logoLink = "/"] 로고 클릭 시 이동할 URL 주소
 *    @param {String} [logoSetting.logoColor = "#f1f4f5"] logoSetting.logo가 String일 때 StringColor.
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
  menuStyle,
  children = <div />,
}) {
  const { bgColor, bgHoverColor, fontColor, size, depthSize, headerColor, gap } = menuStyle;
  const { logo, logoLink = '/', logoColor = '#f1f4f5' } = logoSetting;
  return (
    <HeaderWrap headerColor={headerColor} logoColor={logoColor}>
      <NavLink to={logoLink}>{logo}</NavLink>
      <CreateMenu
        menus={menuList}
        useDepth={useDepth}
        userRole={userRole}
        bgColor={bgColor}
        bgHoverColor={bgHoverColor}
        fontColor={fontColor}
        size={size}
        depthSize={depthSize}
        gap={gap}
      />
      {children}
    </HeaderWrap>
  );
}

const HeaderWrap = styled.div`
  width: calc(100% - 30px);
  background: ${({ headerColor }) => headerColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 65px;
  position: relative;
  z-index: 10;

  & > a {
    color: ${({ logoColor }) => logoColor};
  }
`;

export default HeaderCreator;
