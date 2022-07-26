# seed-ui

---

-   [[1] 헤더 생성](#1-헤더-생성)
-   [[2] 메뉴 생성](#2-메뉴-생성)

<center>
  <img
    src="./readmeImg/menu.jpg"
  />
</center>

## [1] 헤더 생성

```JavaScript
/**
 * @param {Object} logoSeeting ={
 *  @param {String or Component} logo
 *  로고
 *  @param {String} logoLink(Default = "/")
 *  로고 클릭 시 이동할 주소
 *  @param {String or HexaColorCode} logoColor(Default = "#f1f4f5")
 *  로고가 String일 때 로고의 색
 * }
 *
 *
 * @param {ObjectArray} menuList
 * 헤더에 생성될 메뉴 리스트 [2] 메뉴 생성 참고
 *
 * @param {Boolean} useDepth(Default : True)
 * 메뉴의 Depth 기능 사용 유무
 *
 * @param {Object} menuStyle = {
 *  @param {String or HexaColorCode} headerColor
 *  헤더 Background-color
 *  @param {String or HexaColorCode} bgColor
 *  메뉴 Background-color
 *  @param {String or HexaColorCode} bgHoverColor
 *  메뉴 호버 시 변경 될 Background-color
 *  @param {String or HexaColorCode} fontColor
 *  메뉴 fontColor
 *  @param {Array} size
 *  메뉴의 사이즈 [가로, 세로]
 *  @param {Array} depthSize
 *  useDepth 사용 시 나오는 Depth의 사이즈 [가로, 세로]
 *  @param {Integer} gap
 *  상단 메뉴의 사이 공백의 크기
 * }
 *
 * @children {String or Component}
 * 헤더의 우측에 위치 할 Component
 */
function Index(props) {
	return (
		<>
		<HeaderCreator
			logoSetting={{
				logo: 'SQLCanvas Post',
				logoLink: '/',
				logoColor: '#a8455e',
			}}
			menuList={DepthList1}
			useDepth={true}
			menuStyle={{
				headerColor: 'rebeccapurple',
				bgColor: 'red',
				bgHoverColor: 'blue',
				fontColor: 'aqua',
				size: [5.5, 35],
				depthSize: [200, 40],
				gap: 20,
			}}
		>{헤더 우측 컴포넌트}</HeaderCreator>
	</>
	);
}
```

## [2] 메뉴 생성

-   메뉴 리스트 예시

```JavaScript
/**
 * @param {String} title
 * 메뉴에 들어갈 텍스트, map key 역할 [unique]
 *
 * @param {String} link(option)
 * URL Path
 * NavLink to={link}
 *
 * @param {String} routePath(option)
 * routePath
 * <Route path={routePath} />
 * routePath가 없으면 link가 routePath로 설정
 *
 * @param {component} component(option)
 * 해당 URL에 보여줄 컴포넌트
 * <Route element={component} />
 *
 * @param {Integer} userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 *
 * @param {Array} subMenu(option)
 *  - 해당 메뉴 하위로 나올 메뉴
 *
 * @return
 * function CreateMenu
 * return
 * <ul>
 *  <li>
 *    <a link={link}>{title}</a> or ...SubMenu
 *  </li>
 *  ...
 * </ul>
 * function setRoute
 * return
 * <Route path={routePath ? routePath : link} element={component}>
 *    <...SubRoute>
 * </Route>
 */
export const DepthList1 = [
  {
    title: '작업',
    link: '/job',
    component: <Work />,
    menuRole: 3,
  },
  {
    title: '프로젝트',
    link: '/project',
    component: <Project />,
    menuRole: 3,
  },
  {
    title: '설정',
    link: 'config',
    routePath: 'config/*',
    component: <Config />,
    menuRole: 1,
    subMenu: [
      {
        id: 5_1,
        title: '업무 등록',
        link: '/work',
        routePath: 'work',
        component: <System />,
      },
      {
        id: 5_2,
        title: '테이블 동기화',
        link: '/sync',
        routePath: 'sync',
        component: <Sync />,
      },
      {
        id: 5_3,
        title: '매크로 설정',
        link: '/macro',
        routePath: 'macro',
        component: <Macro />,
        subMenu: [
          {
            id: 5_4,
            title: '업무 등록1',
            link: '/work',
            routePath: 'work',
            component: <System />,
          },
          {
            id: 5_5,
            title: '테이블 동기화2',
            link: '/sync',
            routePath: 'sync',
            component: <Sync />,
          },
          {
            id: 5_6,
            title: '매크로 설정3',
            link: '/macro',
            routePath: 'macro',
            component: <Macro />,
          },
        ],
      },
    ],
  },
];

```
