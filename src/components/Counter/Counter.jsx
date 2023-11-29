import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

function Counter({ targetValue, time }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [animate, setAnimate] = useState(false);
  const prevTargetValueRef = useRef(0);

  useEffect(() => {
    if (targetValue !== prevTargetValueRef.current) {
      setCurrentValue(0);
      prevTargetValueRef.current = targetValue;
      setAnimate(false);
    }
  }, [targetValue]);

  useEffect(() => {
    let interval;
    if (currentValue < targetValue) {
      interval = setInterval(() => {
        setCurrentValue(prevValue => {
          const newValue = prevValue + 1;
          if (newValue === targetValue) {
            clearInterval(interval);
            setAnimate(true);
          }
          return newValue;
        });
      }, time);
    }
    return () => clearInterval(interval);
  }, [currentValue, targetValue, time]);

  return <NumberWrapper animate={animate ? 1 : 0}>{currentValue}</NumberWrapper>;
}

const OdometerAnimation = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const animateOdometer = css`
  ${OdometerAnimation} 1s forwards;
`;

const NumberWrapper = styled.p`
  font-weight: 600;
  ${({ animate }) => (animate ? animateOdometer : 'none')};
`;

export default Counter;
