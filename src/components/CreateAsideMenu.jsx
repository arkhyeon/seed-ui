import React, { Fragment, useState } from 'react';
import { NavLink, Route, useLocation, useParams, useMatch } from 'react-router-dom';
import styled from '@emotion/styled';
import _ from 'lodash';

const CreateAsideMenu = (props) => {
  const menus = props.menus;
  const [selectedMenus, setSelectedMenus] = useState(['테이블 동기화']);
  const { pathname, state } = useLocation();

  const handleMenuSelection = (label, depth) => {
    setSelectedMenus((selectedMenus) => {
      const newSelectedMenus = [...selectedMenus];
      newSelectedMenus.length = depth;
      console.log(selectedMenus);
      console.log(newSelectedMenus);
      console.log(label);
      console.log(depth);
      if (label !== '') {
        newSelectedMenus[depth] = label;
      }
      return newSelectedMenus;
    });
  };
  console.log(pathname);
  return (
    <>
      {menus.map((menu) => {
        const menuCHeck = pathname.split('/');

        if (!('subMenu' in menu)) {
          return;
        }

        if (!menuCHeck.includes(menu.link)) {
          return;
        }

        return (
          <>
            {menu.navigate ? (
              <SideTitle style={{ cursor: 'pointer' }}>
                <span>{menu.title}</span>
              </SideTitle>
            ) : (
              <SideTitle>
                <span>{menu.title}</span>
              </SideTitle>
            )}
            {menu.subMenu.map((subMenu) => {
              return (
                <>
                  <SubMenuItem
                    menu={subMenu}
                    handleMenuSelection={handleMenuSelection}
                    key={menu.title}
                    selectedMenus={selectedMenus}
                    bgColor={props.bgColor}
                    bgHoverColor={props.bgHoverColor}
                    fontColor={props.fontColor}
                    size={props.size}
                    depthSize={props.depthSize}
                    useDepth={props.useDepth}
                    userRole={props.userRole}
                  />
                </>
              );
            })}
          </>
        );
      })}
    </>
  );
};

const SubMenuItem = ({
  menu,
  handleMenuSelection,
  selectedMenus,
  bgColor,
  bgHoverColor,
  fontColor,
  size,
  depthSize,
  userRole,
  useDepth,
  depth = 0,
}) => {
  const { title, link = '', subMenu = [], menuRole = 99 } = menu;

  if (userRole > menuRole) {
    return null;
  }

  return (
    <>
      {subMenu.length > 0 && useDepth ? (
        <SubMenuItem.Item
          bgcolor={bgColor}
          bghovercolor={bgHoverColor}
          fontcolor={fontColor}
          depthsize={depthSize}
        >
          <NavLink
            to={link}
            onClick={(event) => {
              event.preventDefault();
              handleMenuSelection(title, depth);
            }}
            style={{ cursor: 'default' }}
          >
            {title}
          </NavLink>
          {selectedMenus[depth] === title && (
            <SubMenuItem.List depth={depth} className="subMenuItem" bghovercolor={bgHoverColor}>
              {subMenu.map((child, i) => {
                const childDepth = depth + 1;
                return (
                  <SubMenuItem
                    menu={child}
                    handleMenuSelection={handleMenuSelection}
                    key={`sub-${title}-${i}`}
                    depth={childDepth}
                    useDepth={useDepth}
                    userRole={userRole}
                    selectedMenus={selectedMenus}
                    size={size}
                    bgHoverColor={bgHoverColor}
                    depthSize={depthSize}
                  />
                );
              })}
            </SubMenuItem.List>
          )}
        </SubMenuItem.Item>
      ) : (
        <SubMenuItem.Item
          bghovercolor={bgHoverColor}
          fontcolor={fontColor}
          depthsize={depthSize}
          bgcolor={bgColor}
          onClick={() => handleMenuSelection('', depth)}
          // onClick={() => handleMenuSelection('', 0)}
          className="mainActive"
        >
          <NavLink to={link}>{title}</NavLink>
        </SubMenuItem.Item>
      )}
    </>
  );
};

SubMenuItem.List = styled.ul`
  & li {
  }

  & li:nth-of-type(1) {
  }
  text-align: left;
  opacity: 0.95;
  transition: 0.5s;
  flex-direction: column;
  display: flex;
`;

SubMenuItem.Item = styled.li`
  &:hover > a,
  & .active,
  &.mainActive:active > a {
  }

  & a {
    display: block;
  }

  & ul li a {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    text-indent: 15px;
  }
`;

const SideTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  height: 35px;
  color: #ffffff;
  background-color: rgb(196, 196, 196);
  border: none;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0px 20px;

  & svg {
    font-size: 21px;
  }
`;

export default CreateAsideMenu;
