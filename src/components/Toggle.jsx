import React from 'react';
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

  const handleToggle = btnValue => {
    setValue(btnValue);
  };

  const renderBtn = () => {
    return (
      <>
        {list.map((el, idx) => (
          <Button
            className="toggle-items"
            key={`toggle-${idx}`}
            btnValue={idx + 1}
            value={value}
            onClick={() => handleToggle(idx + 1)}
          >
            {el}
          </Button>
        ))}
      </>
    );
  };

  return <Wrapper>{renderBtn()}</Wrapper>;
}

const Wrapper = styled.div`
  display: inline-block;
  border-radius: 4px;
  background: transparent;
`;

const Button = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 14px;
  color: #545454;
  margin-right: 18px;

  :hover,
  :active {
    font-weight: bold;

    :after {
      content: '';
      display: block;
      border-bottom: 2px solid #212529;
      margin-top: 10px;
    }
  }
`;

export default Toggle;
