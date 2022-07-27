import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import styled from '@emotion/styled';
import { MdArrowBackIosNew } from 'react-icons/md';
import CreateAsideMenu from './CreateAsideMenu';

function AsideCreator({ menus, title, children }) {
  const resizeAside = useRef();
  const navigate = useNavigate();
  const targetMenu = _.find(menus, { title: title });
  const [resizer, setResizer] = useState({
    currentScreenX: 0,
    mouseActive: false,
    currentWidth: 0,
    maxWidth: 0,
  });

  useEffect(() => {
    collapseStyle(window.sessionStorage.getItem('AsideWidth') || 265);
  }, []);
  //
  // const resizingStart = (e) => {
  //   document.body.style.userSelect = 'none';
  //
  //   setResizer({
  //     currentScreenX: e.screenX,
  //     mouseActive: true,
  //     currentWidth: resizeAside.current.clientWidth,
  //     maxWidth: window.innerWidth,
  //   });
  // };
  //
  // window.onmousemove = (e) => resizing(e);
  //
  // const resizing = _.debounce((e) => {
  //   if (resizer.mouseActive) {
  //     const move = e.screenX - resizer.currentScreenX;
  //     const newWidth = resizer.currentWidth + move;
  //
  //     resizeAside.current.style.width = newWidth + 'px';
  //
  //     collapseStyle(newWidth);
  //   }
  // }, 1);
  //
  const collapseStyle = (currentWidth) => {
    const classList = resizeAside.current.classList;

    classList.toggle('narrow', currentWidth > 183 && currentWidth < 203);
    classList.toggle('narrower', currentWidth <= 183);

    if (!resizer.mouseActive) {
      resizeAside.current.style.width = currentWidth + 'px';
    }

    window.sessionStorage.setItem('AsideWidth', currentWidth);
  };
  //
  // window.onmouseup = (e) => resizingDone(e);
  //
  // const resizingDone = () => {
  //   if (resizer.mouseActive) {
  //     document.body.style.userSelect = 'unset';
  //     setResizer({ ...resizer, mouseActive: false });
  //   }
  // };

  const toggleCollapse = () => {
    const isNarrower = resizeAside.current.classList.contains('narrower');
    isNarrower ? collapseStyle(265) : collapseStyle(43);
  };

  return (
    <Container>
      <AsideWrap ref={resizeAside}>
        {targetMenu.navigate ? (
          <SideTitle style={{ cursor: 'pointer' }} onClick={() => navigate(targetMenu.navigate)}>
            {targetMenu.icon} <span>{targetMenu.title}</span>
          </SideTitle>
        ) : (
          <SideTitle>
            {targetMenu.icon} <span>{targetMenu.title}</span>
          </SideTitle>
        )}
        <hr />
        <CreateAsideMenu currentSideMenu={targetMenu.subMenu} />
        <hr />
        <ToggleButton onClick={() => toggleCollapse()}>
          <MdArrowBackIosNew />
        </ToggleButton>
      </AsideWrap>
      {/*<ResizerBar onMouseDown={(e) => resizingStart(e)} />*/}
      <MainWrap>{children}</MainWrap>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const AsideWrap = styled.div`
  width: 265px;
  max-width: 265px;
  min-width: 43px;
  padding: 15px;
  background-color: ${({ theme }) => theme.asideMenuStyle.backgroundColor};

  & a {
    margin: 2px 0 0 0;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.asideMenuStyle.fontColor};
    text-align: left;
    border-radius: 3px;
    padding: 7px 16px 7px 20px;
    display: flex;
    gap: 5px;
    height: 21px;
    align-items: center;

    & svg {
      font-size: 20px;
      min-width: 20px;
      display: block;
    }

    &:hover,
    &.active {
      color: ${({ theme }) => theme.asideMenuStyle.hoverFontColor};
      background-color: ${({ theme }) => theme.asideMenuStyle.hoverBackgroundColor};
    }
  }

  //&.narrow a {
  //  padding: 7px 12px 7px 16px;
  //  & .nav-item {
  //    flex-direction: column;
  //    height: auto;
  //  }
  //
  //  & svg {
  //    font-size: 23px;
  //  }
  //
  //  & span {
  //    text-align: center;
  //    font-size: 0.9em;
  //  }
  //}

  &.narrower {
    & > div {
      padding: 0;
    }

    a {
      padding: 7px 0px 7px 0px;
    }

    svg {
      margin: 0 auto;
      font-size: 22px;
    }

    span {
      display: none;
    }

    & ul li a p,
    & ul li ul {
      display: none;
    }

    & > div:last-child svg {
      transform: rotate(180deg);
    }
  }

  & hr {
    margin: 15px 0;
    border-color: ${({ theme }) => theme.asideMenuStyle.divideLine};
  }
`;

const SideTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  height: 35px;
  color: ${({ theme }) => theme.asideMenuStyle.fontColor};
  background-color: ${({ theme }) => theme.asideMenuStyle.hoverBackgroundColor};
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

const MainWrap = styled.div`
  flex: 1;
  padding: 15px;
  min-height: calc(100vh - 80px);
`;

// const ResizerBar = styled.div`
//   width: 4px;
//   background-color: rgb(196, 196, 196);
//   border-right: 1px solid rgb(196, 196, 196);
//   cursor: ew-resize;
//
//   &:hover {
//     border-right: 3px solid #a9a9a9;
//   }
// `;

const ToggleButton = styled.div`
  width: 35px;
  height: 35px;
  background-color: ${({ theme }) => theme.asideMenuStyle.backgroundColor};
  border-radius: 3px;
  margin: 25px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.asideMenuStyle.hoverFontColor};
    background-color: ${({ theme }) => theme.asideMenuStyle.hoverBackgroundColor};
  }

  & svg {
    font-size: 20px;
    color: ${({ theme }) => theme.asideMenuStyle.fontColor};
  }
`;

export default AsideCreator;
