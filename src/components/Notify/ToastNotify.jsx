import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { cancelConfirm, deleteAlert, deleteConfirm, useNotifyStore } from '../../R2wZustand';
import { BlackButton, WhiteButton } from '../Button/Button';
import EscStack from '../../common/EscStack';

/**
 * CLM 알림 렌더러. 앱 최상단에 한 번만 렌더한다.
 * 토스트: CLM.alert / alertInfo / alertSuccess  (string | { title, message })
 * 컨펌:   CLM.alertError / CLM.confirm  (Promise 반환)
 *
 * 모양: 카드 왼쪽 끝 3px 색 선 + 제목 앞 20px 원 아이콘.
 *   일반 확인 = 검정 선(아이콘 없음) · 삭제·중지(type: 'danger') = 빨강 ! · 오류 = 빨강 ✕
 *   성공 = 파랑 ✓ · 정보 = 회색 i
 */
function ToastNotify({ interval = 3000 }) {
  const { toastList, confirm } = useNotifyStore();

  return (
    <div id="toast-wrap">
      <ToastWrap>
        {toastList.map(({ id, content, type }) => (
          <ToastAlert key={id} id={id} content={content} interval={interval} type={type} />
        ))}
      </ToastWrap>
      {confirm && (
        <DimOverlay
          onMouseDown={e => {
            if (e.target === e.currentTarget) cancelConfirm();
          }}
        >
          <ToastConfirm {...confirm} />
        </DimOverlay>
      )}
    </div>
  );
}

export default ToastNotify;

/* ───────── 아이콘 ───────── */
const GLYPH = {
  error: <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" />,
  danger: <path d="M6 2.8v4M6 9.2v.1" />,
  success: <path d="M2.8 6.3 5 8.4l4.2-4.6" />,
  info: <path d="M6 5.4v3.8M6 2.9v.1" />,
};

function Glyph({ tone, flush }) {
  return (
    <GlyphBox aria-hidden="true" flush={flush}>
      <svg
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPH[tone] ?? GLYPH.info}
      </svg>
    </GlyphBox>
  );
}

const TONE_COLOR = {
  plain: 'var(--seed-text)',
  danger: 'var(--seed-danger)',
  error: 'var(--seed-danger)',
  success: '#03a7f1',
  info: 'var(--seed-text-muted)',
};

/* ───────── 토스트 ───────── */
function ToastAlert({ id, content, interval, type }) {
  const { title, message } =
    content && typeof content === 'object' ? content : { title: '', message: content };
  const tone = type === 'success' || type === 'error' ? type : 'info';
  const timer = useRef();
  const left = useRef(interval);
  const startedAt = useRef(0);

  const arm = useCallback(() => {
    clearTimeout(timer.current);
    startedAt.current = Date.now();
    timer.current = setTimeout(() => deleteAlert(id), left.current);
  }, [id]);

  const pause = useCallback(() => {
    clearTimeout(timer.current);
    left.current = Math.max(800, left.current - (Date.now() - startedAt.current));
  }, []);

  useLayoutEffect(() => {
    arm();
    const handler = () => deleteAlert(id);
    EscStack.push(handler);
    return () => {
      clearTimeout(timer.current);
      EscStack.remove(handler);
    };
  }, [id, arm]);

  return (
    <ToastCard
      role="status"
      tone={tone}
      noTitle={!title}
      onClick={() => deleteAlert(id)}
      onMouseEnter={pause}
      onMouseLeave={arm}
    >
      <Glyph tone={tone} flush={!title} />
      <TextBox>
        {title && <Title>{title}</Title>}
        <Message solo={!title}>{message}</Message>
      </TextBox>
    </ToastCard>
  );
}

/* ───────── 컨펌 / 오류 ───────── */
function ToastConfirm({ title, message = '', detail, buttons, type = '' }) {
  const { responseHandler } = useNotifyStore();
  const boxRef = useRef();
  const primaryRef = useRef();
  const cancelRef = useRef();

  const isError = type === 'error';
  const isDanger = type === 'danger';
  let tone = 'plain';
  if (isError) tone = 'error';
  else if (isDanger) tone = 'danger';
  const btns = buttons ?? (isError ? ['확인'] : ['취소', '확인']);
  // 버튼이 하나면 그게 주 버튼
  const [cancelText, primaryText, extraText] = btns.length === 1 ? ['', btns[0]] : btns;

  const close = useCallback(
    value => {
      if (responseHandler) responseHandler(value);
      deleteConfirm();
    },
    [responseHandler],
  );

  useEffect(() => {
    // 삭제·중지는 실수로 Enter 쳐도 안 지워지게 [취소]에 포커스
    (isDanger && cancelRef.current ? cancelRef : primaryRef).current?.focus();
    const handler = () => close(false);
    EscStack.push(handler);
    return () => EscStack.remove(handler);
  }, [close, isDanger]);

  // Tab 이 창 안에서만 돌도록
  const trapTab = e => {
    if (e.key !== 'Tab') return;
    const list = [...boxRef.current.querySelectorAll('button, summary')];
    if (!list.length) return;
    const i = list.indexOf(document.activeElement);
    e.preventDefault();
    list[(i + (e.shiftKey ? -1 : 1) + list.length) % list.length].focus();
  };

  return (
    <ConfirmCard
      ref={boxRef}
      role={isError || isDanger ? 'alertdialog' : 'dialog'}
      aria-modal="true"
      tone={tone}
      hasIcon={isError || isDanger}
      onKeyDown={trapTab}
    >
      {(isError || isDanger) && <Glyph tone={tone} flush={!title} />}
      <TextBox scroll>
        {/* 제목 없이 문장만 오면(CLM.alertError('…'), confirm({ message })) 그 문장을 제목 자리에 */}
        {title && <Title>{title}</Title>}
        {message && <Message solo={!title}>{message}</Message>}
      </TextBox>
      {detail && <Detail text={detail} />}
      <Footer>
        {cancelText && (
          <WhiteButton ref={cancelRef} onClick={() => close(false)}>
            {cancelText}
          </WhiteButton>
        )}
        {primaryText &&
          (isDanger ? (
            <DangerButton ref={primaryRef} onClick={() => close(true)}>
              {primaryText}
            </DangerButton>
          ) : (
            <BlackButton ref={primaryRef} onClick={() => close(true)}>
              {primaryText}
            </BlackButton>
          ))}
        {extraText && <BlackButton onClick={() => close(2)}>{extraText}</BlackButton>}
      </Footer>
    </ConfirmCard>
  );
}

function Detail({ text }) {
  return (
    <DetailBox>
      <summary>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
        상세 정보
      </summary>
      <DetailBody>
        <pre>{text}</pre>
      </DetailBody>
    </DetailBox>
  );
}

/* ───────── 스타일 ───────── */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const popIn = keyframes`
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to { opacity: 1; transform: none; }
`;
const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-14px) scale(0.96); }
  to { opacity: 1; transform: none; }
`;

const ToastWrap = styled.div`
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999; /* 확인창(99998) 위, GuideTour(100000) 아래 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 440px;
  max-width: calc(100vw - 32px);
  pointer-events: none;
`;

const DimOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(18, 20, 23, 0.42);
  z-index: 99998;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  animation: ${fadeIn} 0.16s ease-out both;
`;

// 확인창·토스트 공통 카드: 왼쪽 3px 색 선(border-left)
const cardBase = ({ tone }) => css`
  --notify-tone: ${TONE_COLOR[tone] ?? TONE_COLOR.plain};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 440px;
  max-width: 100%;
  background: var(--seed-surface);
  color: var(--seed-text);
  border-left: 3px solid var(--notify-tone);
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 12px 32px -8px rgba(0, 0, 0, 0.28);
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 10px;
  align-items: start;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
`;

const ConfirmCard = styled.div`
  ${cardBase}
  padding: 18px 20px 16px 19px;
  outline: none;
  animation: ${popIn} 0.18s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
  ${({ hasIcon }) =>
    !hasIcon &&
    css`
      grid-template-columns: 1fr;
      width: 400px;

      details {
        grid-column: 1;
      }
    `}
`;

const ToastCard = styled.div`
  ${cardBase}
  padding: 16px 20px 16px 19px;
  cursor: pointer;
  user-select: none;
  pointer-events: all;
  transition: background 0.12s;
  animation: ${dropIn} 0.3s cubic-bezier(0.2, 0.9, 0.3, 1) both;
  ${({ noTitle }) =>
    noTitle &&
    css`
      align-items: center;
    `}

  &:hover {
    background: var(--seed-surface-alt);
  }
`;

const GlyphBox = styled.span`
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  /* 제목 줄(22px) 또는 본문 줄(20px) 안에서 세로 가운데 */
  margin-top: ${({ flush }) => (flush ? '0' : '1px')};
  border-radius: 50%;
  background: var(--notify-tone);
  color: #fff;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const TextBox = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${({ scroll }) =>
    scroll &&
    css`
      max-height: 60vh;
      overflow-y: auto;
    `}
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 22px;
  color: var(--seed-text);
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const Message = styled.div`
  color: var(--seed-text-secondary);
  line-height: 1.45;
  ${({ solo }) =>
    solo &&
    css`
      color: var(--seed-text);
      line-height: 20px;
    `}
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const DetailBox = styled.details`
  grid-column: 2;
  margin-top: 12px;

  summary {
    cursor: pointer;
    font-size: 12.5px;
    color: var(--seed-text-secondary);
    list-style: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    user-select: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary svg {
    width: 12px;
    height: 12px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.15s;
  }
  &[open] summary svg {
    transform: rotate(90deg);
  }
`;

const DetailBody = styled.div`
  position: relative;
  margin-top: 8px;
  background: var(--seed-surface-alt);
  border: 1px solid var(--seed-border);
  border-radius: 8px;

  pre {
    margin: 0;
    padding: 10px 12px;
    font: 12px/1.55 ui-monospace, Consolas, monospace;
    max-height: 140px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

const Footer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const DangerButton = styled(BlackButton)`
  background: var(--seed-danger);
  border-color: transparent;
  color: #fff;

  :hover {
    background: var(--seed-danger);
    color: #fff;
    filter: brightness(0.94);
  }
`;
