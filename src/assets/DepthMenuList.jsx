import React from 'react';
import Work from './Work.jsx';
import Config from './Config.jsx';
import System from './System.jsx';
import Sync from './Sync.jsx';
import Macro from './Macro.jsx';
import {
  MdBuildCircle,
  MdEmail,
  MdSend,
  MdSettings,
  MdSwapHorizontalCircle,
  MdUploadFile,
} from 'react-icons/all';

/**
 * @param {String} title
 * 메뉴에 들어갈 텍스트, map key 역할[unique]
 * @param {String} link(option)
 * URL Path
 * NavLink to={link}
 * routePath가 없으면 link가 routePath로 설정
 * @param {String} routePath(option)
 * routePath
 * Route path={routePath}
 * @param {component} component(option)
 * 해당 URL에 보여줄 컴포넌트
 * Route element={component}
 * @param {Integer} userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 * @param {Array} subMenu(option)
 *  - 해당 메뉴 하위로 나올 메뉴
 *
 * @return
 * function CreateMenu = title, link, subMenu 사용
 * function setRoute   = title, link, subMenu, component 사용
 */
export const DepthList1 = [
  {
    title: '작업',
    link: 'wr',
    component: <Work />,
    menuRole: 3,
  },
  {
    title: '글자가 늘어나면',
    link: 'te',
    component: <Sync />,
    menuRole: 3,
  },
  {
    title: '설정',
    link: 'config',
    routePath: 'config',
    component: <Config />,
    icon: <MdSettings />,
    menuRole: 1,
    subMenu: [
      {
        id: 5_1,
        title: '업무 등록',
        link: '/config/work',
        routePath: 'work',
        component: <System />,
        menuRole: 1,
        icon: <MdSettings />,
      },
      {
        id: 5_2,
        title: '테이블 동기화',
        link: '/config/sync',
        routePath: 'sync',
        component: <Sync />,
        icon: <MdSettings />,
        subMenu: [
          {
            id: 5_4,
            title: '업무 등록2',
            link: '/config/sync/work',
            routePath: 'work',
            component: <System />,
            icon: <MdSettings />,
          },
          {
            id: 5_5,
            title: '테이블 동기화2',
            link: 'sync1',
            routePath: 'sync1',
            component: <Sync />,
            icon: <MdSettings />,
          },
          {
            id: 5_6,
            title: '매크로 설정2',
            link: 'macro1',
            routePath: 'macro1',
            component: <Macro />,
            icon: <MdSettings />,
          },
        ],
      },
      {
        id: 5_3,
        title: '매크로 설정',
        link: '/config/macro',
        routePath: 'macro',
        component: <Macro />,
        icon: <MdSettings />,
        subMenu: [
          {
            id: 5_4,
            title: '업무 등록1',
            link: 'work1',
            routePath: 'work1',
            component: <System />,
            icon: <MdSettings />,
          },
          {
            id: 5_5,
            title: '테이블 동기화1',
            link: 'sync1',
            routePath: 'sync1',
            component: <Sync />,
            icon: <MdSettings />,
          },
          {
            id: 5_6,
            title: '매크로 설정1',
            link: '/config/macro/sync1',
            routePath: 'sync1',
            component: <Macro />,
            icon: <MdSettings />,
            subMenu: [
              {
                id: 5_4,
                title: '업무 등록3',
                link: '/config/macro/sync1/work',
                routePath: 'work',
                component: <Work />,
                icon: <MdSettings />,
              },
              {
                id: 5_5,
                title: '테이블 동기화3',
                link: 'sync1',
                routePath: 'sync1',
                component: <Sync />,
                icon: <MdSettings />,
              },
              {
                id: 5_6,
                title: '매크로 설정3',
                link: 'macro1',
                routePath: 'macro1',
                component: <Macro />,
                icon: <MdSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
];
