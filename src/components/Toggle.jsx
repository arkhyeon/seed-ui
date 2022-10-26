import React, { useCallback } from 'react';
import styled from '@emotion/styled';

function Toggle({ list = ['아이템 없음'], value = 1, setValue = null }) {
  /**
   * @param {String []} param.list
   * 토글에 들어갈 텍스트가 담긴 배열
   * default 값은 ['아이템 없음']
   * @param {Number} param.value
   * 선택된 버튼의 값
   * useState로 관리되는 상태값 이여야 함
   * default 값은 1
   * @param {Function} param.setValue
   * 선택된 버튼의 값을 바꾸는 함수
   * useState로 생성된 상태 관리 함수여야 함
   * default 값은 null
   * @returns {JSX.Element} Toggle Component
   */

  const handleToggle = useCallback(
    btnValue => {
      setValue(btnValue);
    },
    [setValue],
  );

  const renderBtn = useCallback(() => {
    return (
      <>
        {list.map((el, idx) => (
          <ToggleButton
            key={el}
            aria-pressed={value === idx + 1 ? true : null}
            value={idx + 1}
            onClick={() => handleToggle(idx + 1)}
            classList="toggle-btn"
          >
            {el}
          </ToggleButton>
        ))}
      </>
    );
  }, [handleToggle, list, value]);

  return <Wrapper>{renderBtn()}</Wrapper>;
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
`;

const ToggleButton = styled.div`
  cursor: pointer;
  font-size: 14px;
  color: #545454;
  padding: 10px 0;
  margin-right: 50px;

  :hover,
  &[aria-pressed] {
    font-weight: bold;
    box-shadow: inset 0 -2px 0 #212529;
  }
`;

export default Toggle;
