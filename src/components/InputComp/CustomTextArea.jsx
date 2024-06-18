import React from 'react';
import styled from '@emotion/styled';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import { BlackButton, WhiteButton } from '../index';

/**
 * @param {String} title
 * CustomTextArea 제목 역할
 * @param {Object} textAreaOption
 * TextArea의 옵션 파라미터. 기존의 속성들을 해당 객체에 넣어 전달하면 됩니다.
 * @param {Object} sqlAreaOption
 * CustomCodeMirror의 옵션 파라미터. 기존의 속성들을 해당 객체에 넣어 전달하면 됩니다.
 * @param [{icon, handler}, ...] IconButtonList
 * CustomTextArea의 타이틀 옆 아이콘 버튼들
 * @param TextButtonList
 * CustomTextArea의 타이틀 옆 텍스트 버튼들
 * @returns {JSX.Element}
 * CustomTextArea 컴포넌트
 */
export default function CustomTextArea({
  key = 0,
  title = '',
  textAreaOption,
  sqlAreaOption,
  IconButtonList = [],
  TextButtonList = [],
}) {
  return (
    <CustomTextAreaWrap key={key}>
      {title !== '' && (
        <CustomTextAreaMenu>
          <p>{title}</p>
          <ButtonListWrapper>
            {IconButtonList.map(({ icon, handler }) => {
              return (
                <WhiteButton key={icon.type.name} onClick={() => handler()}>
                  {icon}
                </WhiteButton>
              );
            })}
            {TextButtonList.map(({ text, handler }) => {
              return (
                <BlackButton key={text} onClick={() => handler()}>
                  {text}
                </BlackButton>
              );
            })}
          </ButtonListWrapper>
        </CustomTextAreaMenu>
      )}
      {textAreaOption && <TextAreaComp {...textAreaOption} />}
      {sqlAreaOption && (
        <CodeMirror
          {...sqlAreaOption}
          theme={sqlAreaOption?.theme || xcodeLight}
          extensions={[sql(), PostgreSQL, ...(sqlAreaOption?.extensions || '')]}
          minHeight="100%"
          maxHeight="100%"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            ...sqlAreaOption?.basicSetup,
          }}
        />
      )}
    </CustomTextAreaWrap>
  );
}

const TextAreaComp = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
  resize: vertical;
  height: ${props => (props.height ? props.height : 'auto')};
`;

const CustomTextAreaWrap = styled.div`
  width: 100%;
`;

const CustomTextAreaMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 34px;
  margin-bottom: 5px;
`;

const ButtonListWrapper = styled.div`
  display: flex;
  gap: 5px;

  button {
    display: flex;
  }

  & button:has(> svg) {
    padding: 5px;
    font-size: 15px;
  }
`;
