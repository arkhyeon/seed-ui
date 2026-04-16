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
    // cursor: 'help',
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
  };

  const popupStyle = {
    position: 'absolute',
    top: '100%',
    left: '80%',
    marginTop: '10px',

    minWidth: '80px',
    width: 'max-content',
    maxWidth: '200px',
    height: 'auto',

    backgroundColor: colors.gray800,
    color: '#fff',
    textAlign: 'center',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '12px',
    lineHeight: '1.4',
    zIndex: 1050,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',

    // 우측 하단으로 살짝 밀려나며 나타나는 효과
    transform: isVisible ? 'translate(0, 0)' : 'translate(-5px, -5px)',
    transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s',
    transitionDelay: isVisible ? '100ms' : '0ms',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordBreak: 'keep-all', // 단어 단위 줄바꿈
    pointerEvents: 'none',
  };

  // 화살표 스타일: 팝업이 이동했으므로 아이콘을 가리키도록 위치 조정
  const arrowStyle = {
    position: 'absolute',
    top: '-6px',
    left: '10px', // 팝업 내에서의 위치
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: `6px solid ${colors.gray800}`,
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
