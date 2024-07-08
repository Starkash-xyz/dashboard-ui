// third-party
import { FormattedMessage } from 'react-intl';

// project import

// assets
import { DashboardOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// import { useGetMenu } from 'api/menu';

const icons = {
  dashboard: DashboardOutlined,
  settings: SettingOutlined,
  loading: LoadingOutlined
};

const dashboard: NavItemType = {
  id: 'group-dashboard-loading',
  title: <FormattedMessage id="dashboard" />,
  type: 'group',
  icon: icons.dashboard,
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      icon: icons.dashboard,
      url: '/dashboard/overview'
    },
    {
      id: 'settings',
      title: <FormattedMessage id="settings" />,
      type: 'item',
      icon: icons.settings,
      url: '/dashboard/settings'
    }
  ]
};

export default dashboard;

// ==============================|| MENU ITEMS - API ||============================== //

// export const MenuFromAPI = () => {
//   const { menu, menuLoading } = useGetMenu();

//   if (menuLoading) return loadingMenu;

//   const subChildrenList = (children: NavItemType[]) => {
//     return children?.map((subList: NavItemType) => {
//       return fillItem(subList);
//     });
//   };

//   const itemList = (subList: NavItemType) => {
//     let list = fillItem(subList);

//     // if collapsible item, we need to feel its children as well
//     if (subList.type === 'collapse') {
//       list.children = subChildrenList(subList.children!);
//     }
//     return list;
//   };

//   const childrenList: NavItemType[] | undefined = menu?.children?.map((subList: NavItemType) => {
//     return itemList(subList);
//   });

//   let menuList = fillItem(menu, childrenList);
//   return menuList;
// };

// function fillItem(item: NavItemType, children?: NavItemType[] | undefined) {
//   return {
//     ...item,
//     title: <FormattedMessage id={`${item?.title}`} />,
//     // @ts-ignore
//     icon: icons[item?.icon],
//     ...(children && { children })
//   };
// }
