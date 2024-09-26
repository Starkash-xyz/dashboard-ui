// types
import { DefaultConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

import StarknetLogo from './assets/images/tokens/starknet.svg';
import ETHLogo from './assets/images/tokens/eth.svg';
import USDCLogo from './assets/images/tokens/usdc.svg';
import DAILogo from './assets/images/tokens/dai.svg';
import LUSDLogo from './assets/images/tokens/lusd.svg';
import USDTLogo from './assets/images/tokens/usdt.svg';

// ==============================|| THEME CONSTANT ||============================== //

export const PAYMENT_SITE_URL = 'https://pay.starkash.xyz';

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

export enum NetworkName {
  Starknet = 'Starknet'
}

export enum NetworkColor {
  Starknet = '#0c0c4f'
}
export interface Network {
  name: NetworkName;
  color: NetworkColor;
}

export interface Token {
  name: string;
  symbol: string;
  network?: Network;
  address: string;
  category: string;
  isSelected: boolean;
  logo: string;
}

export const tokens: Token[] = [
  {
    name: 'STRK',
    symbol: 'STRK',
    network: {
      name: NetworkName.Starknet,
      color: NetworkColor.Starknet
    },
    address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    category: 'popularTokens',
    logo: StarknetLogo,
    isSelected: true
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    network: {
      name: NetworkName.Starknet,
      color: NetworkColor.Starknet
    },
    address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    category: 'popularTokens',
    logo: ETHLogo,
    isSelected: true
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    network: {
      name: NetworkName.Starknet,
      color: NetworkColor.Starknet
    },
    address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    category: 'stableTokens',
    logo: USDCLogo,
    isSelected: true
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    network: {
      name: NetworkName.Starknet,
      color: NetworkColor.Starknet
    },
    address: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
    category: 'stableTokens',
    logo: DAILogo,
    isSelected: true
  },
  {
    name: 'LUSD',
    symbol: 'LUSD',
    network: {
      name: NetworkName.Starknet,
      color: NetworkColor.Starknet
    },
    address: '0x070a76fd48ca0ef910631754d77dd822147fe98a569b826ec85e3c33fde586ac',
    category: 'stableTokens',
    logo: LUSDLogo,
    isSelected: true
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    network: {
      name: NetworkName.Starknet,
      color: NetworkColor.Starknet
    },
    address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    category: 'stableTokens',
    logo: USDTLogo,
    isSelected: true
  }
];

export interface PaymentLink {
  token: Token;
  price: number;
  description: string;
  orderId: string;
  fixedRate: boolean;
  feePaidByUser: boolean;
  createdAt: number;
  invoiceId: string;
  status: string;
  userId: string;
  merchantId: number;
}

export default config;
