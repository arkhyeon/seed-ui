import React, { Fragment, useState } from 'react';
import { NavLink, Route, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

/**
 * @param {Array} props.menus
 * EX) Auth : {userLevel === "1" ? [AdminArray] : [UserArray]}
 *      OR
 *     Common : {[Array]}
 * @param {Boolean} props.useDepth
 * 사이드 메뉴 사용할 때 Depth를 사용할 것인지 아닌지
 * true : Depth 이용 메뉴
 * false : Depth 없이 메뉴
 * @param {Boolean} props.display
 * subMenu에서 Route로만 사용할 메뉴에 대해서 분기 처리
 * default : true, false 설정 시 메뉴에 보이지 않음.
 * @param {int} props.userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 *
 * @returns {JSX.Element} Menu Component
 */

function CreateMenu(props) {
  const menus = props.menus;
  const [selectedMenus, setSelectedMenus] = useState([]);
  const navigate = useNavigate();

  const handleMenuSelection = (label, depth) => {
    setSelectedMenus(selectedMenusProp => {
      const newSelectedMenus = [...selectedMenusProp];
      newSelectedMenus.length = depth;
      if (label !== '') {
        newSelectedMenus[depth] = label;
      }
      return newSelectedMenus;
    });
  };

  return (
    <CreateMenu.List onMouseLeave={() => setSelectedMenus([])}>
      {menus.map(menu => {
        return (
          <SubMenuItem
            menu={menu}
            handleMenuSelection={handleMenuSelection}
            key={menu.title}
            selectedMenus={selectedMenus}
            useDepth={props.useDepth}
            userRole={props.userRole}
            navigate={navigate}
          />
        );
      })}
    </CreateMenu.List>
  );
}

/**
 * @param {Object} menu
 * The object from the repeated sentence.
 * 반복문에서 나온 객체
 * @param {Function} handleMenuSelection
 * Where's my mouse?
 * 어디에 hover 되었는가?
 * @param {Function} selectedMenus
 * useState setState Function
 * 상태 관리
 * @param {Boolean} useDepth
 * 사이드 메뉴 사용할 때 Depth를 사용할 것인지 아닌지
 * true : Depth 이용 메뉴 [default]
 * false : Depth없이 메뉴
 * @param {int} userRole(option)
 * 권한 체크
 * userRole(ulevel)이 menuRole보다 작다면 활성화
 * ex ) userRole[1] > menuRole[3] >> 활성화
 *      userRole[3] > menuRole[1] >> 비활성
 * @param {int} depth
 * depth Level
 * @returns {JSX.Element} Menu Unit Component
 */
function SubMenuItem({
  menu,
  handleMenuSelection,
  selectedMenus,
  userRole,
  useDepth,
  depth = 0,
  navigate,
}) {
  const { title, link = '', subMenu = [], menuRole = 99 } = menu;
  if (userRole > menuRole) {
    return null;
  }
  const restrictMove = e => {
    e.preventDefault();
    if (depth !== 0) {
      navigate(subMenu[0]?.link);
    }
  };

  const location = window.location.pathname;
  const similarActive = subMenu.find(s => location.includes(s.link)) ? 'active' : null;

  return (
    <>
      {subMenu.length > 0 && useDepth && isDisplaySubMenuDepth(subMenu) ? (
        <SubMenuItem.Item>
          <NavLink
            to={link}
            onMouseEnter={() => handleMenuSelection(title, depth)}
            onClick={event => {
              restrictMove(event);
            }}
            style={{ cursor: depth === 0 ? 'default' : 'pointer' }}
            className={similarActive}
          >
            {title}
          </NavLink>
          {selectedMenus[depth] === title && (
            <SubMenuItem.List depth={depth} className="subMenuItem">
              {subMenu.map((child, i) => {
                if (child.display === false) {
                  return '';
                }
                const childDepth = depth + 1;
                return (
                  <SubMenuItem
                    menu={child}
                    handleMenuSelection={handleMenuSelection}
                    key={`sub-${title}${i + 1}`}
                    depth={childDepth}
                    useDepth={useDepth}
                    userRole={userRole}
                    selectedMenus={selectedMenus}
                    navigate={navigate}
                  />
                );
              })}
            </SubMenuItem.List>
          )}
        </SubMenuItem.Item>
      ) : (
        <SubMenuItem.Item
          onMouseEnter={() => handleMenuSelection('', depth)}
          onClick={() => handleMenuSelection('', 0)}
          className="mainActive"
        >
          <NavLink to={subMenu.length !== 0 ? subMenu[0].link : link} className={similarActive}>
            {title}
          </NavLink>
        </SubMenuItem.Item>
      )}
    </>
  );
}

CreateMenu.List = styled.ul`
  display: flex;
  justify-content: center;
  gap: 0;

  & > li {
    & > a {
      width: fit-content;
      height: 55px;
      padding: 0 40px;
      line-height: 55px;
      color: #e0e0e0;
      font-size: 15px;

      &:hover {
        color: white;
        font-weight: bold;
      }
    }
  }
`;

SubMenuItem.List = styled.ul`
  & > li > a {
    float: left;
  }
  position: absolute;
  opacity: 0.95;
  transition: 0.5s;
  flex-direction: column;
  display: flex;
  padding: 10px 0;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  background-color: white;
  box-shadow: 1px 1px 3px 0px #d2d2d2;

  .subMenuItem {
    width: 100%;
    left: 100%;
    float: left;
    margin-top: -11px;
  }
`;

SubMenuItem.Item = styled.li`
  & ul li:hover > a {
    font-weight: bold;
    background-color: #e8eefb;
  }

  & ul li .active,
  & ul li.mainActive:active > a {
    color: #ffffff;
    font-weight: bold;
    background-color: #3e3e3e !important;
  }

  & a {
    display: block;
  }

  & ul li a {
    width: 190px;
    height: 38px;
    font-size: 14px;
    color: #212529;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
`;

/**
 * Route Component를 props에 맞게 자동 생성(재귀 SubRoute())
 * @param {[{component, menuRole: number, link: string, title: string},{component, menuRole: number, link: string, title: string},{subMenu: [{routePath: string, component, menuRole: number, link: string, icon, title: string},{routePath: string, subMenu: [{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string}], link: string, icon, title: string},{routePath: string, subMenu: [{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string},{routePath: string, subMenu: [{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string},{routePath: string, component, link: string, title: string}], link: string, title: string}], link: string, icon, title: string}], menuRole: number, link: string, icon, title: string}]} props
 * @param {int} auth(option)
 * 권한 체크
 * auth(ulevel)이 menuRole보다 작다면 활성화
 * ex ) auth[1] > menuRole[3] >> 활성화
 *      auth[3] > menuRole[1] >> 비활성
 * @returns
 * Route Component
 */
export function SetRoute(props, auth) {
  return (
    <>
      {props.map(route => {
        if (auth > route.menuRole) {
          return '';
        }
        return SubRoute(route);
      })}
    </>
  );
}

/**
 * @param {Object} route
 * @param {int} depth
 * depth Level
 * @returns
 * Route Component
 */
function SubRoute(route, depth = 0) {
  const { component, link = '', title, subMenu = [], routePath } = route;
  return (
    <Fragment key={title}>
      {subMenu.length > 0 ? (
        <Route path={routePath || link} element={component}>
          {subMenu.map(child => {
            const childDepth = depth + 1;
            return SubRoute(child, childDepth);
          })}
        </Route>
      ) : (
        <Route path={routePath || link} element={component} />
      )}
    </Fragment>
  );
}

// export const setMsgRoute = () => {
// 	return (
// 		<Route path="Message" element={<Message />}>
// 			<Route path="MessageReceive" element={<MessageList />} />
// 			<Route path="MessageReceive/MessageDetail" element={<MessageDetail />} />
// 			<Route path="MessageDispatch" element={<MessageList />} />
// 			<Route path="MessageDispatch/MessageDetail" element={<MessageDetail />} />
// 			<Route path="MessageWrite" element={<MessageWrite />} />
// 		</Route>
// 	);
// };

export const isDisplaySubMenuDepth = subMenu => {
  let subMenuDisplayCount = 0;

  for (let i = 0; i < subMenu.length; i++) {
    if (subMenu[i].display !== undefined && !subMenu[i].display) {
      subMenuDisplayCount++;
    }
  }
  if (subMenuDisplayCount === subMenu.length) {
    return false;
  }

  return true;
};

export default CreateMenu;
