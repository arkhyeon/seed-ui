import React from 'react';
import AsideCreator from '../components/AsideCreator';
import { DepthList1 } from './DepthMenuList';
import styled from '@emotion/styled';

function Work(props) {
  return (
    <>
      <StyledTest menus={DepthList1} title={'설정'}>
        Hello Work!@
      </StyledTest>
    </>
  );
}

const StyledTest = styled(AsideCreator)`
  font-size: 212px;
  & div {
    background: red !important;
  }
  background: red !important;
`;

export default Work;
