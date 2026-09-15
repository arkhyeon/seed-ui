import React from 'react';
import styled from '@emotion/styled';

/**
 * SideTab 내부 분할선
 * @returns {JSX.Element}
 * @constructor
 */
function DividingLine(props) {
  return <Line {...props} />;
}

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: var(--seed-border);
`;

export default DividingLine;
