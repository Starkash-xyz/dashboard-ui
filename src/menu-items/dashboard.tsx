// third-party
import { FormattedMessage } from 'react-intl';

// project import

// assets
import { DashboardOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons';
import { RiToolsLine } from 'react-icons/ri';
// type
import { NavItemType } from 'types/menu';

// import { useGetMenu } from 'api/menu';

const icons = {
  dashboard: DashboardOutlined,
  paymentTools: RiToolsLine,
  settings: SettingOutlined,
  loading: LoadingOutlined
};

const dashboard: NavItemType = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  icon: icons.dashboard,
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      icon: icons.dashboard,
      url: '/dashboard/'
    },
    {
      id: 'Payment Tools',
      title: <FormattedMessage id="payment-tools" />,
      type: 'collapse',
      icon: icons.paymentTools,
      children: [
        {
          id: 'payment-link',
          title: <FormattedMessage id="payment-link" />,
          type: 'item',
          url: '/invoices'
        }
        // {
        //   id: 'donations',
        //   title: <FormattedMessage id="donations" />,
        //   type: 'item',
        //   url: '/dashboard/donations'
        // },
        // {
        //   id: 'subscriptions',
        //   title: <FormattedMessage id="subscriptions" />,
        //   type: 'item',
        //   url: '/dashboard/subscriptions'
        // }
      ]
    },
    {
      id: 'settings',
      title: <FormattedMessage id="settings" />,
      type: 'collapse',
      icon: icons.settings,
      children: [
        {
          id: 'tokens',
          title: <FormattedMessage id="tokens" />,
          type: 'item',
          url: '/settings/tokens'
        }
      ]
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
