import React, { useState } from 'react';

/**
 * HelpIcon Component
 * @param {string} message - 팝업에 표시될 메시지
 * @param {number} size - 아이콘의 크기 (기본값 20)
 */

function HelpIcon({ message = '', size = 20 }) {
  const [isVisible, setIsVisible] = useState(false);

  const colors = {
    gray600: '#6c757d',
    gray800: 'rgba(33, 37, 41, 0.9)',
    border: 'rgba(108, 117, 125, 0.5)',
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5px', // 아이콘 텍스트 사이 간격
  };

  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: `1.5px solid ${colors.border}`,
    color: colors.gray600,
    fontSize: `${size * 0.65}px`,
    fontWeight: '700',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  };

  const popupStyle = {
    position: 'absolute',
    /* 우측 배치 설정 */
    left: '100%',
    top: '50%',
    transform: isVisible
      ? 'translate(12px, -50%)' // 노출 시: 우측으로 12px 이동 및 수직 중앙 정렬
      : 'translate(5px, -50%)', // 미노출 시:  왼쪽에서 대기

    marginLeft: '0px',
    // minWidth: '120px',
    maxWidth: '250px',
    width: 'max-content',
    height: 'auto',

    backgroundColor: colors.gray800,
    color: '#fff',
    textAlign: 'left',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '12px',
    lineHeight: '1.4',

    /* 최우선 순위 유지 및 줄바꿈 설정 */
    zIndex: 9999,
    wordBreak: 'break-all',
    overflowWrap: 'anywhere',

    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'none',
  };

  const arrowStyle = {
    position: 'absolute',
    /* 왼쪽 화살표 설정 */
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: `6px solid ${colors.gray800}`,
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div
        style={{
          ...iconStyle,
          backgroundColor: isVisible ? '#f8f9fa' : 'transparent',
        }}
      >
        !
      </div>
      {message !== '' && (
        <div style={popupStyle}>
          {message}
          <div style={arrowStyle} />
        </div>
      )}
    </div>
  );
}

export default HelpIcon;
