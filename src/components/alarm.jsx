const defaultValue = {
  position: 'center',
  width: '400px',
  height: '100px',
  timeLimit: 10000,
  type: 'light',
  text: '텍스트를 입력해주세요.',
  callback: () => {
    alert('입력 받은 함수가 없습니다.');
  },
  yBtnText: '확인',
  nBtnText: '취소',
};

const colors = {
  success: {
    darkBg: 'rgb(49, 79 ,53)',
    main1: 'rgb(83, 133, 76)',
    main2: 'rgb(177, 202, 178)',
    borderBg: '#eee',
  },
  error: {
    darkBg: 'rgb(75, 37, 37)',
    main1: '#dd3d32',
    main2: 'rgb(220, 179, 179)',
    borderBg: '#eee',
  },
  warning: {
    darkBg: 'rgb(70, 50, 19)',
    main1: '#db9021',
    main2: 'rgb(243, 215, 174)',
    borderBg: '#eee',
  },
  info: {
    darkBg: 'rgb(21, 58, 74)',
    main1: '#2294c7',
    main2: 'rgb(165, 209, 227)',
    borderBg: `#eee`,
  },
};

const iconSrcs = {
  success: {
    lightIcon: 'src/img/alarm/lightSuccess.svg',
    darkIcon: 'src/img/alarm/darkSuccess.svg',
  },
  error: {
    lightIcon: 'src/img/alarm/lightError.svg',
    darkIcon: 'src/img/alarm/darkError.svg',
  },
  warning: {
    lightIcon: 'src/img/alarm/lightWarning.svg',
    darkIcon: 'src/img/alarm/darkWarning.svg',
  },
  info: {
    lightIcon: 'src/img/alarm/lightInfo.svg',
    darkIcon: 'src/img/alarm/darkInfo.svg',
  },
  close: {
    light: 'src/img/alarm/lightClose.svg',
    success: 'src/img/alarm/successClose.svg',
    error: 'src/img/alarm/errorClose.svg',
    warning: 'src/img/alarm/warningClose.svg',
    info: 'src/img/alarm/infoClose.svg',
  },
};

const setTypeStyle = (
  wrapperDiv,
  iconDiv,
  closeBtnDiv,
  titleDiv,
  textDiv,
  progressDiv,
  type,
  name,
) => {
  switch (type) {
    case 'dark':
      iconDiv.src = iconSrcs[name].darkIcon;
      closeBtnDiv.src = iconSrcs.close.light;

      wrapperDiv.style.background = colors[name].darkBg;
      titleDiv.style.fontWeight = 'bold';
      titleDiv.style.color = colors[name].main2;
      textDiv.style.color = colors[name].main2;
      break;

    case 'light':
      iconDiv.src = iconSrcs[name].lightIcon;
      closeBtnDiv.src = iconSrcs.close.light;

      titleDiv.style.color = 'white';
      titleDiv.style.fontWeight = 'bold';
      wrapperDiv.style.background = colors[name].main1;
      textDiv.style.color = 'white';

      break;

    case 'border':
      iconDiv.src = iconSrcs[name].darkIcon;
      closeBtnDiv.src = iconSrcs.close[name];

      titleDiv.style.color = colors[name].main1;
      titleDiv.style.fontWeight = 'bold';
      wrapperDiv.style.border = `3px solid ${colors[name].main1}`;
      wrapperDiv.style.background = colors[name].borderBg;
      textDiv.style.color = colors[name].main1;
      progressDiv.style.background = colors[name].main1;

      break;

    default:
      break;
  }
};

const typeStyle = {
  success: {
    dark: {
      iconSrc: 'src/img/alarm/darkSuccess.svg',
      wrapperBg: `${colors.success.darkBg}`,
      closeBtnSrc: 'src/img/alarm/lightClose.svg',
      titleFW: 'bold',
      textColor: `${colors.success.main2}`,
    },
    light: {
      iconSrc: 'src/img/alarm/lightSuccess.svg',
      titleColor: 'white',
      titleFW: 'bold',
      wrapperBg: `${colors.success.main1}`,
      closeBtnSrc: 'src/img/alarm/lightClose.svg',
      textColor: 'white',
    },
    border: {
      iconSrc: 'src/img/alarm/darkSuccess.svg',
      titleColor: `${colors.success.main1}`,
      titleFW: 'bold',
      wrapperBorder: `3px solid ${colors.success.main1}`,
      wrapperBg: `${colors.success.borderBg}`,
      closeBtnSrc: 'src/img/alarm/successClose.svg',
      textColor: `${colors.success.main1}`,
      progressBg: `${colors.success.main1}`,
    },
  },
};

const setPosition = (position, div, width, height) => {
  if (position === 'left-start') {
    Object.assign(div.style, {
      top: '1px',
      left: '1px',
    });
  }
  if (position === 'left-center') {
    Object.assign(div.style, {
      top: `${window.innerHeight / 2 - height.slice(0, -2) / 2}px`,
      left: `1px`,
    });
  }
  if (position === 'left-end') {
    Object.assign(div.style, {
      top: `${window.innerHeight - height.slice(0, -2) - 16}px`,
      left: '1px',
    });
  }
  if (position === 'center-start') {
    Object.assign(div.style, {
      top: `1px`,
      left: `${window.innerWidth / 2 - width.slice(0, -2) / 2}px`,
    });
  }
  if (position === 'center') {
    Object.assign(div.style, {
      top: `${window.innerHeight / 2 - height.slice(0, -2) / 2}px`,
      left: `${window.innerWidth / 2 - width.slice(0, -2) / 2}px`,
    });
  }
  if (position === 'center-end') {
    Object.assign(div.style, {
      top: `${window.innerHeight - height.slice(0, -2) - 16}px`,
      left: `${window.innerWidth / 2 - width.slice(0, -2) / 2}px`,
    });
  }
  if (position === 'right-start') {
    Object.assign(div.stlye, {
      top: `1px`,
      left: `${window.innerWidth - width.slice(0, -2) - 16}px`,
    });
  }
  if (position === 'right-center') {
    Object.assign(div.style, {
      top: `${window.innerHeight / 2 - height.slice(0, -2) / 2}px`,
      left: `${window.innerWidth - width.slice(0, -2) - 16}px`,
    });
  }
  if (position === 'right-end') {
    Object.assign(div.style, {
      top: `${window.innerHeight - height.slice(0, -2) - 16}px`,
      left: `${window.innerWidth - width.slice(0, -2) - 16}px`,
    });
  }
};

const setWrapperStyle = (div, width, height) => {
  Object.assign(div.style, {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 999,
    width,
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
  });
};

const setAlertStyle = (div, width, height) => {
  Object.assign(div.style, {
    width,
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
  });
};

const setIconStyle = div => {
  Object.assign(div.style, {
    width: '30px',
    height: '30px',
    marginRight: '8px',
  });
};

const setTitleStyle = (div, text) => {
  div.textContent = text;
};

const setTextStyle = (div, text) => {
  Object.assign(div.style, {
    padding: '8px',
    paddingTop: '4px',
    paddingLeft: '16px',
  });

  div.textContent = text;
};

const setProgressStyle = (div, width, timeLimit) => {
  Object.assign(div.style, {
    width: '100%',
    height: '10px',
    background: '#eee',
  });

  const progressSpinning = [
    { transform: 'translate(0, 0)' },
    { transform: `translate(-${width}, 0)` },
  ];

  const progressTiming = {
    duration: timeLimit,
    iterations: 1,
  };

  div.animate(progressSpinning, progressTiming);
};

const setCloseStyle = (wrapper, div) => {
  const handleClose = () => {
    wrapper.remove();
  };

  div.addEventListener('click', handleClose);

  Object.assign(div.style, {
    width: `20px`,
    height: '20px',
    marginLeft: 'auto',
    marginRight: '15px',
    cursor: 'pointer',
  });
};

const appendToParent = (parentDiv, ...children) => {
  for (let i = 0; i < children.length; i++) {
    parentDiv.append(children[i]);
  }
};

/**
 * @param {String} props.name
 * 안내 창의 성격
 * 'success' (default)
 * 'error'
 * 'warning'
 * 'info'
 * 'answer'
 * @param {String} props.position
 * 안내 창이 뜨는 위치
 * 'left-start'
 * 'left-center'
 * 'left-end'
 * 'center-start'
 * 'center' (default)
 * 'center-end'
 * 'right-start'
 * 'right-center'
 * 'right-end'
 * @param {String} props.width
 * 안내 창의 너비
 * default 값은 '400px'
 * @param {String} props.height
 * 안내 창의 높이
 * default 값은 '100px'
 * @param {Number} props.timeLimit
 * 안내 창의 지속 시간
 * default 값은 10000
 * @param {String} props.type
 * 안내 창의 형태
 * 'dark'
 * 'light' (default)
 * 'border'
 * @param {String} props.title
 * 안내 창의 제목
 * name === 'success'일 시, default 값은 성공
 * name === 'error'일 시, default 값은 에러
 * name === 'warning'일 시, default 값은 경고
 * name === 'info'일 시, default 값은 안내
 * name === 'answer'일 시, default 값은 확인
 * @param {String} props.text
 * 안내 창의 상세 문구
 * default 값은 '텍스트를 입력해주세요.'
 * @param {Function} props.callback
 * (name === 'answer'일 때) 확인 버튼을 눌렀을 때 실행될 함수
 * default 값은 null
 * @param {String} props.yBtnText
 * (name === 'answer'일 때) 확인 버튼에 들어갈 텍스트
 * default 값은 '확인'
 * @param {String} props.nBtnText
 * (name === 'answer'일 때) 취소 버튼에 들어갈 텍스트
 * default 값은 '취소'
 * @returns {Void}
 */

const alarm = ({
  position = defaultValue.position,
  width = defaultValue.width,
  height = defaultValue.height,
  timeLimit = defaultValue.timeLimit,
  type = defaultValue.type,
  title,
  text = defaultValue.text,
  name = 'success',
  callback = defaultValue.callback,
  yBtnText = defaultValue.yBtnText,
  nBtnText = defaultValue.nBtnText,
} = {}) => {
  if (title === undefined) {
    switch (name) {
      case 'success':
        title = '성공';
        break;

      case 'error':
        title = '에러';
        break;

      case 'warning':
        title = '경고';
        break;

      case 'info':
        title = '안내';
        break;

      case 'answer':
        title = '확인';
        break;

      default:
        break;
    }
  }

  const wrapper = document.createElement('div');
  const alertDiv = document.createElement('div');
  const iconDiv = document.createElement('img');
  const titleDiv = document.createElement('div');
  const progressDiv = document.createElement('div');
  const closeBtn = document.createElement('img');
  const textDiv = document.createElement('div');
  const btnWrapper = document.createElement('div');
  const yesBtn = document.createElement('button');
  const noBtn = document.createElement('button');

  function handleY() {
    wrapper.remove();
    callback();
  }
  function handleN() {
    wrapper.remove();
  }

  if (name === 'answer') {
    setWrapperStyle(wrapper, width, height);
    setAlertStyle(alertDiv, width, height);
    setIconStyle(iconDiv);
    setTitleStyle(titleDiv, title);
    setTextStyle(textDiv, text);
    setProgressStyle(progressDiv, width, timeLimit);
    setCloseStyle(wrapper, closeBtn);

    Object.assign(btnWrapper.style, {
      display: 'flex',
      justifyContent: 'center',
      margin: '8px 0',
    });

    yesBtn.textContent = yBtnText;

    Object.assign(yesBtn.style, {
      background: '#eee',
      borer: 'none',
      outline: 'none',
      padding: '4px',
      borderRadius: '4px',
      marginRight: '4px',
      width: '50px',
      cursor: 'pointer',
    });

    yesBtn.addEventListener('click', handleY);

    noBtn.textContent = nBtnText;

    Object.assign(noBtn.style, {
      background: '#eee',
      border: 'none',
      outline: 'none',
      padding: '4px',
      borderRadius: '4px',
      marginLeft: '4px',
      width: '50px',
      cursor: 'pointer',
    });

    noBtn.addEventListener('click', handleN);

    if (type === 'dark') {
      iconDiv.src = 'src/img/alarm/darkAnswer.svg';
      wrapper.style.background = 'rgb(77, 77 ,77)';
      titleDiv.style.color = '#eee';
      titleDiv.style.fontWeight = 'bold';
      textDiv.style.color = '#eee';
      closeBtn.src = 'src/img/alarm/lightClose.svg';
      noBtn.style.background = 'rgb(77, 77 ,77)';
      noBtn.style.color = '#eee';
    }
    if (type === 'light') {
      iconDiv.src = 'src/img/alarm/lightAnswer.svg';
      titleDiv.style.color = 'black';
      titleDiv.style.fontWeight = 'bold';
      wrapper.style.background = 'rgb(227, 227, 227)';
      closeBtn.src = 'src/img/alarm/answerClose.svg';
      textDiv.style.color = 'black';

      yesBtn.style.background = '#808080';
      yesBtn.style.color = '#eee';

      noBtn.style.background = '#eee';
    }
    if (type === 'border') {
      iconDiv.src = 'src/img/alarm/lightAnswer.svg';
      titleDiv.style.color = 'black';
      titleDiv.style.fontWeight = 'bold';
      wrapper.style.border = '3px solid #808080';
      wrapper.style.background = '#eee';
      textDiv.style.color = 'black';
      closeBtn.src = 'src/img/alarm/answerClose.svg';
      progressDiv.style.background = '#808080';

      yesBtn.style.background = '#808080';
      yesBtn.style.color = '#eee';
      yesBtn.style.border = 'none';

      noBtn.style.background = '#eee';
    }

    appendToParent(alertDiv, iconDiv, titleDiv, closeBtn);
    setPosition(position, wrapper, width, height);
    appendToParent(btnWrapper, yesBtn, noBtn);
    appendToParent(wrapper, alertDiv, textDiv, btnWrapper, progressDiv);

    document.body.appendChild(wrapper);

    setTimeout(() => {
      wrapper.remove();
    }, timeLimit);
    return;
  }

  setWrapperStyle(wrapper, width, height);
  setAlertStyle(alertDiv, width, height);
  setIconStyle(iconDiv);
  setTitleStyle(titleDiv, title);
  setTextStyle(textDiv, text);
  setProgressStyle(progressDiv, width, timeLimit);
  setCloseStyle(wrapper, closeBtn);
  setTypeStyle(wrapper, iconDiv, closeBtn, titleDiv, textDiv, progressDiv, type, name);

  appendToParent(alertDiv, iconDiv, titleDiv, closeBtn);
  setPosition(position, wrapper, width, height);
  appendToParent(wrapper, alertDiv, textDiv, progressDiv);

  document.body.appendChild(wrapper);

  setTimeout(() => {
    wrapper.remove();
  }, timeLimit);
};

export default alarm;
