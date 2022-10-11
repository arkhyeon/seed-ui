import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { DepthList1 } from './assets/DepthMenuList';
import { DatePicker, HeaderCreator } from './components';

import Logo from './assets/Logo';
import ItemList from './components/ItemList/ItemList';
import TypeList from './components/TypeList/TypeList';

function Index() {
  const click = id => {
    console.log(id);
  };

  return (
    <div>
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

      <Container>
        {/* <ItemList /> */}
        <div style={{ width: '300px' }}>
          <TypeList list={['그룹1', '그룹2', '그룹3']} />
        </div>
      </Container>
    </div>
  );
}

const Container = styled.div`
  width: 1200px;
  height: 600px;
  position: absolute;
  top: 10%;
  left: 10%;
  border: 1px solid black;
`;

export default Index;
