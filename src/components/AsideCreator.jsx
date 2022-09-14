import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { MdExpandMore } from 'react-icons/md';
import CreateAsideMenu from './CreateAsideMenu';

function AsideCreator({ menuList, title, logoSetting = {}, children }) {
  const targetMenu = menuList.filter(menu => menu.title === title)[0];
  const { logo, logoLink = '/' } = logoSetting;

  return (
    <Container>
      {logo && (
        <NavLink id="asideLogo" to={logoLink}>
          {logo}
        </NavLink>
      )}
      <AsideWrap id="asideContainer">
        <SideTitle>
          <span>{targetMenu.title}</span> <MdExpandMore />
        </SideTitle>
        <CreateAsideMenu currentSideMenu={targetMenu.subMenu} />
      </AsideWrap>
      <MainWrap>{children}</MainWrap>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;

  & > a {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: white;
    border-bottom: 1px solid #bdbdbd;
    transition: 0.4s;

    & > div {
      color: black;
      & > span {
        color: white;
      }
    }
  }
`;

const AsideWrap = styled.div`
  width: 239px;
  max-width: 239px;
  min-width: 239px;
  padding: 16px 18px;
  font-size: 15px;
  transition: 0.4s;

  & ul li a {
    margin: 2px 0 0 0;
    color: #212529;
    text-align: left;
    border-radius: 5px;
    padding: 10px 15px;
    display: flex;
    align-items: center;

    & svg {
      font-size: 20px;
      min-width: 20px;
      display: block;
    }

    &:hover {
      font-weight: bold;
      background-color: #e8eefb;
    }
    &.active {
      font-weight: bold;
      color: white;
      background-color: #212529 !important;
    }
  }
`;

const SideTitle = styled.div`
  font-size: 15px;
  color: #212529;
  border-radius: 5px;
  padding: 10px 15px;
  background-color: #e8eefb;
  display: flex;
  justify-content: space-between;

  & svg {
    font-size: 20px;
  }
`;

const MainWrap = styled.div`
  flex: 1;
`;

export default AsideCreator;
