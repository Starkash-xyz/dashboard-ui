// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { handlerCustomerDialog } from 'api/customer';

// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined
} from '@ant-design/icons';

// type
import { NavActionType, NavItemType } from 'types/menu';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'chat',
  title: <FormattedMessage id="chat" />,
  type: 'item',
  url: '/apps/chat',
  icon: icons.MessageOutlined,
  breadcrumbs: false
};

export default applications;
