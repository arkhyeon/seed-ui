import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { DepthList1 } from './assets/DepthMenuList';
import { DatePicker, HeaderCreator } from './components';

import Logo from './assets/Logo';
import AlertToast from './components/Alert/AlertToast';

function Index() {
  const click = id => {
    console.log(id);
  };

  return (
    <div>
      <AlertToast />
      <HeaderCreator
        logoSetting={{
          logo: <Logo />,
          logoLink: '/',
        }}
        menuList={DepthList1}
        useDepth
        userRole={1}
      >
        <div>
          <NavLink to="children">Children</NavLink>
        </div>
      </HeaderCreator>

      <Outlet />

      {/* <Container> */}
      {/*  <ItemList */}
      {/*    title="그룹" */}
      {/*    itemList={[ */}
      {/*      { id: 1, value: 'item_1' }, */}
      {/*      { id: 2, value: 'item_2' }, */}
      {/*      { id: 3, value: 'item_3' }, */}
      {/*    ]} */}
      {/*    click={click} */}
      {/*  /> */}
      {/* </Container> */}
    </div>
  );
}

// const Container = styled.div`
//   background: orange;
//   width: 1200px;
//   height: 600px;
//   position: absolute;
//   top: 10%;
//   left: 10%;
//   border: 1px solid black;
// `;

export default Index;
