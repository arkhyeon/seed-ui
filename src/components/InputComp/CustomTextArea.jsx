import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import { BlackButton, WhiteButton } from '../index';

// CodeMirror 확장은 렌더마다 재생성하면 에디터 전체가 재구성되어 입력 랙/깜빡임을 유발한다.
// 모듈 스코프 고정 배열로 재사용한다.
const SQL_EXTENSIONS = [sql(), PostgreSQL, EditorView.lineWrapping];

// <html data-theme="dark"> 를 구독해 CodeMirror 테마를 라이트/다크로 자동 전환
function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark',
  );
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.getAttribute('data-theme') === 'dark');
    update();
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

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
  const isDark = useIsDarkTheme();

  // 렌더마다 새 객체가 되면 CodeMirror가 재구성되므로 메모이즈한다.
  const theme = sqlAreaOption?.theme || (isDark ? xcodeDark : xcodeLight);
  const basicSetup = useMemo(
    () => ({ lineNumbers: false, foldGutter: false, ...sqlAreaOption?.basicSetup }),
    [sqlAreaOption?.basicSetup],
  );

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

  const replaceTabOnPaste = EditorView.domEventHandlers({
    paste(event, view) {
      const text = event.clipboardData?.getData('text/plain');

      if (!text) return false;

      const newText = text.replace(/\t/g, '    ');

      event.preventDefault();

      view.dispatch(view.state.replaceSelection(newText));

      return true;
    },
  });

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
          theme={theme}
          extensions={[replaceTabOnPaste, ...SQL_EXTENSIONS]}
          minHeight="100%"
          maxHeight="100%"
          basicSetup={basicSetup}
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
  border: 1px solid var(--seed-border);
  background: var(--seed-surface);
  color: var(--seed-text);
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
