import React, { useState, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * HelpIcon Component
 */
function HelpIcon({ message = '', size = 20 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  const colors = {
    gray600: '#6c757d',
    gray800: 'rgba(33, 37, 41, 0.9)',
    border: 'rgba(108, 117, 125, 0.5)',
  };

  // 아이콘의 위치를 계산하여 포털 팝업의 위치를 결정합니다.
  const updatePosition = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2, // 수직 중앙
        left: rect.left + rect.width + 12, // 아이콘 우측 12px 지점
      });
    }
  };

  // 팝업이 열릴 때나 스크롤/리사이즈 시 위치 업데이트
  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isVisible]);

  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: `1.5px solid ${colors.border}`,
    color: colors.gray600,
    fontSize: `${size * 0.65}px`,
    fontWeight: '700',
    backgroundColor: isVisible ? '#f8f9fa' : 'transparent',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    marginLeft: '5px',
    verticalAlign: 'middle',
  };

  const popupStyle = {
    position: 'fixed',
    top: `${coords.top}px`,
    left: `${coords.left}px`,
    transform: 'translateY(-50%)',

    maxWidth: '250px',
    width: 'max-content',
    backgroundColor: colors.gray800,
    color: '#fff',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '1.4',
    zIndex: 10000, // 최상위 유지

    /* 줄바꿈 설정 */
    wordBreak: 'break-all',
    overflowWrap: 'anywhere',

    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'opacity 0.2s, visibility 0.2s',
  };

  const arrowStyle = {
    position: 'absolute',
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: `6px solid ${colors.gray800}`,
  };

  return (
    <>
      {/* 아이콘 부분 */}
      <div
        ref={iconRef}
        style={iconStyle}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        !
      </div>

      {/* 포털을 이용한 말풍선 부분 */}
      {message &&
        ReactDOM.createPortal(
          <div style={popupStyle}>
            {message}
            <div style={arrowStyle} />
          </div>,
          document.body,
        )}
    </>
  );
}

export default HelpIcon;
