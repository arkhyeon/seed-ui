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
    lightIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse stroke='white' ry='89.5' rx='89.5' id='svg_10' cy='101.5' cx='100.5' fill-opacity='0' stroke-width='10' fill='%23000000'/%3E%3Cg id='svg_14'%3E%3Cline id='svg_11' y2='144.89118' x2='91.89118' y1='99' x1='46' fill-opacity='0' stroke-width='10' stroke='white' fill='none'/%3E%3Cline id='svg_13' y2='71.82897' x2='159.17103' y1='145' x1='86' fill-opacity='0' stroke-width='10' stroke='white' fill='none'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
    darkIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse stroke='%2358a15c' ry='89.5' rx='89.5' id='svg_10' cy='101.5' cx='100.5' fill-opacity='0' stroke-width='10' fill='%23000000'/%3E%3Cg id='svg_14'%3E%3Cline id='svg_11' y2='144.89118' x2='91.89118' y1='99' x1='46' fill-opacity='0' stroke-width='10' stroke='%2358a15c' fill='none'/%3E%3Cline id='svg_13' y2='71.82897' x2='159.17103' y1='145' x1='86' fill-opacity='0' stroke-width='10' stroke='%2358a15c' fill='none'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
  },
  error: {
    lightIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill-opacity="0" stroke="white" stroke-width="10" ry="89.99999" rx="89.99999" id="svg_1" cy="100.49999" cx="98.99999" fill="%23000000"/%3E%3Ctext transform="matrix(2.06412 0 0 1.22397 -97.6366 16.5265)" stroke="white" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="150" id="svg_2" y="125.16692" x="73.18491" stroke-width="0" fill="white"%3E!%3C/text%3E%3C/g%3E%3C/svg%3E`,
    darkIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill-opacity="0" stroke="%23dd3d32" stroke-width="10" ry="89.99999" rx="89.99999" id="svg_1" cy="100.49999" cx="98.99999" fill="%23000000"/%3E%3Ctext transform="matrix(2.06412 0 0 1.22397 -97.6366 16.5265)" stroke="%23dd3d32" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="150" id="svg_2" y="125.16692" x="73.18491" stroke-width="0" fill="%23dd3d32"%3E!%3C/text%3E%3C/g%3E%3C/svg%3E`,
  },
  warning: {
    lightIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath fill-opacity="0" stroke="white" id="svg_6" d="m12.865,192.62161l88.00001,-179.60848l88.00001,179.60848l-176.00001,0z" stroke-width="10" fill="%23000000"/%3E%3Ctext transform="matrix(1.60474 0 0 0.88954 -57.1294 31.2502)" stroke="white" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="150" id="svg_9" y="161.50329" x="77.56082" stroke-width="0" fill="white"%3E!%3C/text%3E%3C/g%3E%3C/svg%3E`,
    darkIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath fill-opacity="0" stroke="%23db9021" id="svg_6" d="m12.865,192.62161l88.00001,-179.60848l88.00001,179.60848l-176.00001,0z" stroke-width="10" fill="%23000000"/%3E%3Ctext transform="matrix(1.60474 0 0 0.88954 -57.1294 31.2502)" stroke="%23db9021" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="150" id="svg_9" y="161.50329" x="77.56082" stroke-width="0" fill="%23db9021"%3E!%3C/text%3E%3C/g%3E%3C/svg%3E`,
  },
  info: {
    lightIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill-opacity="0" stroke="white" stroke-width="10" ry="89.99999" rx="89.99999" id="svg_1" cy="100.49999" cx="98.99999" fill="%23000000"/%3E%3Crect stroke="%23dd3d32" id="svg_3" height="80" width="24" y="91" x="87" stroke-width="0" fill="white"/%3E%3Cellipse ry="18" rx="18" id="svg_4" cy="59" cx="99" stroke-width="0" stroke="%23dd3d32" fill="white"/%3E%3C/g%3E%3C/svg%3E`,
    darkIcon: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill-opacity="0" stroke="%232294c7" stroke-width="10" ry="89.99999" rx="89.99999" id="svg_1" cy="100.49999" cx="98.99999" fill="%23000000"/%3E%3Crect stroke="%23dd3d32" id="svg_3" height="80" width="24" y="91" x="87" stroke-width="0" fill="%232294c7"/%3E%3Cellipse ry="18" rx="18" id="svg_4" cy="59" cx="99" stroke-width="0" stroke="%23dd3d32" fill="%232294c7"/%3E%3C/g%3E%3C/svg%3E`,
  },
  close: {
    light: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="white" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="white" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
    success: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="rgb(83, 133, 76)" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="rgb(83, 133, 76)" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
    error: `data:image/svg+xml;charset=utf-8,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke='%23dd3d32' stroke-width='30' stroke-linecap='undefined' stroke-linejoin='undefined' id='svg_1' y2='191' x2='189.99998' y1='11' x1='10' fill='none'/%3E%3Cline stroke-linecap='undefined' stroke-linejoin='undefined' id='svg_2' y2='12.46607' x2='190.53393' y1='193' x1='10' stroke-width='30' stroke='%23dd3d32' fill='none'/%3E%3C/g%3E%3C/svg%3E`,
    warning: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="%23db9021" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="%23db9021" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
    info: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="%232294c7" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="%232294c7" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
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
      iconSrc: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse stroke="%2358a15c" ry="89.5" rx="89.5" id="svg_10" cy="101.5" cx="100.5" fill-opacity="0" stroke-width="10" fill="%23000000"/%3E%3Cg id="svg_14"%3E%3Cline id="svg_11" y2="144.89118" x2="91.89118" y1="99" x1="46" fill-opacity="0" stroke-width="10" stroke="%2358a15c" fill="none"/%3E%3Cline id="svg_13" y2="71.82897" x2="159.17103" y1="145" x1="86" fill-opacity="0" stroke-width="10" stroke="%2358a15c" fill="none"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
      wrapperBg: `${colors.success.darkBg}`,
      closeBtnSrc: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="white" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="white" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
      titleFW: 'bold',
      textColor: `${colors.success.main2}`,
    },
    light: {
      iconSrc: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse stroke="white" ry="89.5" rx="89.5" id="svg_10" cy="101.5" cx="100.5" fill-opacity="0" stroke-width="10" fill="%23000000"/%3E%3Cg id="svg_14"%3E%3Cline id="svg_11" y2="144.89118" x2="91.89118" y1="99" x1="46" fill-opacity="0" stroke-width="10" stroke="white" fill="none"/%3E%3Cline id="svg_13" y2="71.82897" x2="159.17103" y1="145" x1="86" fill-opacity="0" stroke-width="10" stroke="white" fill="none"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
      titleColor: 'white',
      titleFW: 'bold',
      wrapperBg: `${colors.success.main1}`,
      closeBtnSrc: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="white" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="white" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
      textColor: 'white',
    },
    border: {
      iconSrc: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse stroke="%2358a15c" ry="89.5" rx="89.5" id="svg_10" cy="101.5" cx="100.5" fill-opacity="0" stroke-width="10" fill="%23000000"/%3E%3Cg id="svg_14"%3E%3Cline id="svg_11" y2="144.89118" x2="91.89118" y1="99" x1="46" fill-opacity="0" stroke-width="10" stroke="%2358a15c" fill="none"/%3E%3Cline id="svg_13" y2="71.82897" x2="159.17103" y1="145" x1="86" fill-opacity="0" stroke-width="10" stroke="%2358a15c" fill="none"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
      titleColor: `${colors.success.main1}`,
      titleFW: 'bold',
      wrapperBorder: `3px solid ${colors.success.main1}`,
      wrapperBg: `${colors.success.borderBg}`,
      closeBtnSrc: `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="rgb(83, 133, 76)" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="rgb(83, 133, 76)" fill="none"/%3E%3C/g%3E%3C/svg%3E`,
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
      top: `${window.innerHeight - height.slice(0, -2) - 50}px`,
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
      top: `${window.innerHeight - height.slice(0, -2) - 50}px`,
      left: `${window.innerWidth / 2 - width.slice(0, -2) / 2}px`,
    });
  }
  if (position === 'right-start') {
    Object.assign(div.style, {
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
      top: `${window.innerHeight - height.slice(0, -2) - 50}px`,
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
    progressDiv.classList.add('alarm-answer-progress');
    setCloseStyle(wrapper, closeBtn);

    Object.assign(btnWrapper.style, {
      display: 'flex',
      justifyContent: 'center',
      margin: '8px 0',
    });

    yesBtn.textContent = yBtnText;
    yesBtn.classList.add('alarm-yesBtn');

    Object.assign(yesBtn.style, {
      background: '#eee',
      border: 'none',
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
    noBtn.classList.add('alarm-noBtn');

    noBtn.addEventListener('click', handleN);

    if (type === 'dark') {
      iconDiv.src = `data:image/svg+xml;charset=utf-8,%3Csvg stroke="%23eee" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill="none" stroke="%23eee" stroke-width="2" d="M20,15 C19,16 21.25,18.75 20,20 C18.75,21.25 16,19 15,20 C14,21 13.5,23 12,23 C10.5,23 10,21 9,20 C8,19 5.25,21.25 4,20 C2.75,18.75 5,16 4,15 C3,14 1,13.5 1,12 C1,10.5 3,10 4,9 C5,8 2.75,5.25 4,4 C5.25,2.75 8,5 9,4 C10,3 10.5,1 12,1 C13.5,1 14,3 15,4 C16,5 18.75,2.75 20,4 C21.25,5.25 19,8 20,9 C21,10 23,10.5 23,12 C23,13.5 21,14 20,15 Z M7,12 L10,15 L17,8"%3E%3C/path%3E%3C/svg%3E`;
      wrapper.style.background = 'rgb(77, 77 ,77)';
      titleDiv.style.color = '#eee';
      titleDiv.style.fontWeight = 'bold';
      textDiv.style.color = '#eee';
      closeBtn.src = `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="white" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="white" fill="none"/%3E%3C/g%3E%3C/svg%3E`;
      noBtn.style.background = 'rgb(77, 77 ,77)';
      noBtn.style.color = '#eee';
    }
    if (type === 'light') {
      iconDiv.src = `data:image/svg+xml;charset=utf-8,%3Csvg stroke='black' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='black' stroke-width='2' d='M20,15 C19,16 21.25,18.75 20,20 C18.75,21.25 16,19 15,20 C14,21 13.5,23 12,23 C10.5,23 10,21 9,20 C8,19 5.25,21.25 4,20 C2.75,18.75 5,16 4,15 C3,14 1,13.5 1,12 C1,10.5 3,10 4,9 C5,8 2.75,5.25 4,4 C5.25,2.75 8,5 9,4 C10,3 10.5,1 12,1 C13.5,1 14,3 15,4 C16,5 18.75,2.75 20,4 C21.25,5.25 19,8 20,9 C21,10 23,10.5 23,12 C23,13.5 21,14 20,15 Z M7,12 L10,15 L17,8'%3E%3C/path%3E%3C/svg%3E`;
      titleDiv.style.color = 'black';
      titleDiv.style.fontWeight = 'bold';
      wrapper.style.background = 'rgb(227, 227, 227)';
      closeBtn.src = `data:image/svg+xml;charset=utf-8,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke='black' stroke-width='30' stroke-linecap='undefined' stroke-linejoin='undefined' id='svg_1' y2='191' x2='189.99998' y1='11' x1='10' fill='none'/%3E%3Cline stroke-linecap='undefined' stroke-linejoin='undefined' id='svg_2' y2='12.46607' x2='190.53393' y1='193' x1='10' stroke-width='30' stroke='black' fill='none'/%3E%3C/g%3E%3C/svg%3E`;
      textDiv.style.color = 'black';

      yesBtn.style.background = '#808080';
      yesBtn.style.color = '#eee';

      noBtn.style.background = '#eee';
    }
    if (type === 'border') {
      iconDiv.src = `data:image/svg+xml;charset=utf-8,%3Csvg stroke="black" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill="none" stroke="black" stroke-width="2" d="M20,15 C19,16 21.25,18.75 20,20 C18.75,21.25 16,19 15,20 C14,21 13.5,23 12,23 C10.5,23 10,21 9,20 C8,19 5.25,21.25 4,20 C2.75,18.75 5,16 4,15 C3,14 1,13.5 1,12 C1,10.5 3,10 4,9 C5,8 2.75,5.25 4,4 C5.25,2.75 8,5 9,4 C10,3 10.5,1 12,1 C13.5,1 14,3 15,4 C16,5 18.75,2.75 20,4 C21.25,5.25 19,8 20,9 C21,10 23,10.5 23,12 C23,13.5 21,14 20,15 Z M7,12 L10,15 L17,8"%3E%3C/path%3E%3C/svg%3E`;
      titleDiv.style.color = 'black';
      titleDiv.style.fontWeight = 'bold';
      wrapper.style.border = '3px solid #808080';
      wrapper.style.background = '#eee';
      textDiv.style.color = 'black';
      closeBtn.src = `data:image/svg+xml;charset=utf-8,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="Layer_1"%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cline stroke="black" stroke-width="30" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_1" y2="191" x2="189.99998" y1="11" x1="10" fill="none"/%3E%3Cline stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_2" y2="12.46607" x2="190.53393" y1="193" x1="10" stroke-width="30" stroke="black" fill="none"/%3E%3C/g%3E%3C/svg%3E`;
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
  progressDiv.classList.add('alarm-progress');
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
