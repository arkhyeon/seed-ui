import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { MdExpandMore } from 'react-icons/md';
import { MdMenu } from 'react-icons/all';
import { css } from '@emotion/react';
import CreateAsideMenu from './CreateAsideMenu';

function AsideCreator({ menuList, title, logoSetting = {}, children }) {
  const targetMenu = menuList.filter(menu => menu.title === title)[0];
  const { logo, logoLink = '/' } = logoSetting;
  const [hide, setHide] = useState(false);

  const SideHide = () => {
    setHide(prevState => {
      return !prevState;
    });
  };

  return (
    <Container hide={hide}>
      {logo && <NavLink to={logoLink}>{logo}</NavLink>}
      <MdMenu onClick={SideHide} />
      <AsideWrap hide={hide}>
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
    transition: 0.2s;
    color: black;

    ${({ hide }) => {
      return (
        hide &&
        css`
          left: -275px;
        `
      );
    }};

    & div span {
      color: white;
    }
  }

  & > svg {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 275px;
    color: white;
    font-size: 26px;
    padding: 14.5px;
    cursor: pointer;
  }
`;

const AsideWrap = styled.div`
  width: 239px;
  max-width: 239px;
  min-width: 239px;
  padding: 16px 18px;
  font-size: 15px;
  transition: 0.2s;

  ${({ hide }) => {
    return (
      hide &&
      css`
        margin-left: -275px;
      `
    );
  }};

  & ul li a {
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
      background-color: #cfd8dc;
    }
  }

  & > ul > li > a {
    &.active {
      font-weight: bold;
      color: white;
      background-color: #212529 !important;
    }
  }

  & ul li ul li:has(a.active) {
    &:before {
      background: black;
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
  width: 100%;
`;

export default AsideCreator;
