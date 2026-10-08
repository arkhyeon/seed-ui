import React, { forwardRef, useState } from 'react';
import styled from '@emotion/styled';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const TextInput = forwardRef((props, ref) => {
  const enterEvent = e => {
    if (e.key === 'Enter' && props?.enterEvent) {
      e.preventDefault();
      props.enterEvent();
    }
  };

  return (
    <TextInputWrap>
      <TextInputComp
        ref={ref}
        {...props}
        maxLength={props?.maxLength || 100}
        onKeyDown={enterEvent}
      />
    </TextInputWrap>
  );
});

export const PasswordInput = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const enterEvent = e => {
    if (e.key === 'Enter' && props?.enterEvent) {
      e.preventDefault();
      props.enterEvent();
    }
  };

  return (
    <TextInputWrap>
      <TextInputComp
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        {...props}
        maxLength={props?.maxLength || 100}
        onKeyDown={enterEvent}
      />
      <EyeToggle onClick={toggleShowPassword} type="button" tabIndex="-1" aria-hidden="true">
        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </EyeToggle>
    </TextInputWrap>
  );
});

const TextInputWrap = styled.div`
  width: 100%;
  display: flex;
  position: relative;
`;

const TextInputComp = styled.input`
  width: 100%;
  border: 1px solid var(--seed-border);
  border-radius: 5px;
  background: var(--seed-surface);
  color: var(--seed-text);
  font-size: 13px;
  padding: 8px 0 7px 12px;

  &::placeholder {
    font-size: 13px;
    color: var(--x-888);
  }
`;

const EyeToggle = styled.button`
  position: absolute;
  right: 10px;
  top: calc(50% - 8px);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--x-888);
`;

export const DataListInput = forwardRef((props, ref) => {
  return <DataListInputComp ref={ref} {...props} className="seed-select-arrow" />;
});

const DataListInputComp = styled(TextInputComp)`
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23888888' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 16px 12px;
  outline: none;
  padding: 8px 36px 6px 12px;
`;

/**
 * LabelCheckBox
 *  - label : 체크박스 옆 글자
 *  - size  : 체크박스 가로·세로(px), 기본 18 (체크 표시도 비율대로 줄어듦)
 *  - 그 외 props는 input에 그대로 전달 (checked, disabled, onChange, title ...)
 */
export function LabelCheckBox({ label, size = 18, ...props }) {
  return (
    <CheckBoxWrap $size={size}>
      <label htmlFor={props.id}>
        <input type="checkbox" {...props} />
        {label}
      </label>
    </CheckBoxWrap>
  );
}

const CheckBoxWrap = styled.div`
  width: 100%;
  display: flex;

  & label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 14px;
    color: var(--seed-text);

    /* 체크박스 색은 테마와 상관없이 고정 (원래 어두운 회색 톤이라 다크모드에서도 그대로) */
    & input {
      flex-shrink: 0;
      width: ${({ $size }) => $size}px;
      height: ${({ $size }) => $size}px;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 0.15em;
      border: 1px solid #545454;
      outline: none;
      cursor: pointer;

      &:disabled {
        border: 1px solid #d1d1d1;
        background-color: #f9f9f9;
        cursor: not-allowed;
      }

      &:checked {
        background-color: #545454;

        &::before {
          content: '\\2714';
          color: #ffffff;
          /* 18px 기준(글자 14px, 오른쪽·위 2px) 비율로 크기·위치 맞춤 */
          font-size: ${({ $size }) => ($size * 14) / 18}px;
          position: relative;
          left: ${({ $size }) => ($size * 2) / 18}px;
          top: ${({ $size }) => (-$size * 2) / 18}px;
        }
      }

      /* 체크된 채 잠김: 채운 배경 대신 잠긴 칸 + 회색 체크 → 일반 체크보다 약해 보이게 */
      &:disabled:checked {
        border-color: #d1d1d1;
        background-color: #f9f9f9;

        &::before {
          color: #aaaaaa;
        }
      }
    }

    &:has(input:disabled) {
      cursor: not-allowed;
    }
  }
`;
