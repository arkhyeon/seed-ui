import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Accordion, SwitchButton } from '../components/index';

function ConfigSyncTable() {
  const { pathname } = useLocation();
  const [collapse, setCollapse] = useState();
  return (
    <AccordionWrap>
      <Accordion
        title={
          <div>
            aasdasd
            <SwitchButton id="hi" />
          </div>
        }
        collapse={collapse}
        setCollapse={setCollapse}
      >
        <Test />
      </Accordion>
      12312312
      <SwitchButton id="hel" />
    </AccordionWrap>
  );
}

const AccordionWrap = styled.div`
  width: 50%;
`;

const Test = styled.div`
  width: 100%;
  height: 490px;
  background-color: darkorange;
  padding: 30px 15px;
  box-sizing: border-box;
`;

export default ConfigSyncTable;
