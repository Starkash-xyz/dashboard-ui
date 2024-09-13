// types
import { DefaultConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/dashboard/';
export const HORIZONTAL_MAX_ITEM = 7;
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;

// ==============================|| THEME CONFIG ||============================== //

const config: DefaultConfigProps = {
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  themeDirection: ThemeDirection.LTR
};

export interface Coin {
  name: string;
  symbol: string;
  network: string;
}

export const popularCoins: Coin[] = [
  { name: 'STRK', symbol: 'STRK', network: 'Starknet' },
  { name: 'Ethereum', symbol: 'ETH', network: 'Starknet' },
  { name: 'USDC', symbol: 'USDC', network: 'Starknet' }
];

export const stableCoins: Coin[] = [
  { name: 'DAI', symbol: 'DAI', network: 'Starknet' },
  { name: 'LUSD', symbol: 'LUSD', network: 'Starknet' },
  { name: 'Tether USD', symbol: 'USDT', network: 'Starknet' }
];

export default config;
