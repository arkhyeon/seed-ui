import React, { useEffect, useRef } from 'react';
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
  title = '',
  textAreaOption,
  sqlAreaOption,
  IconButtonList = [],
  TextButtonList = [],
  focusOn = false,
}) {
  const textAreaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (focusOn && textAreaRef.current) {
      const textArea = textAreaRef.current;
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length); // 커서를 문장 끝으로 이동
    }
  }, [focusOn]);

  useEffect(() => {
    if (focusOn && editorRef.current) {
      const view = editorRef.current;
      view.focus();
      view.dispatch({
        selection: { anchor: view.state.doc.length }, // 커서를 문장 끝으로 이동
      });
    }
  }, [focusOn]);

  return (
    <CustomTextAreaWrap>
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
      {textAreaOption && <TextAreaComp {...textAreaOption} ref={textAreaRef} />}
      {sqlAreaOption && (
        <CodeMirror
          {...sqlAreaOption}
          theme={sqlAreaOption?.theme || xcodeLight}
          extensions={[sql(), PostgreSQL, EditorView.lineWrapping]}
          minHeight="100%"
          maxHeight="100%"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            ...sqlAreaOption?.basicSetup,
          }}
          onCreateEditor={view => {
            editorRef.current = view;
            if (focusOn) {
              view.focus();
              view.dispatch({
                selection: { anchor: view.state.doc.length }, // 커서를 문장 끝으로 이동
              });
            }
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
