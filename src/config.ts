import { RolesEnum } from 'utils';
import { ProductType } from 'database';

export type ConfigDatabaseTypes = {
  settings: {
    name: string;
    uri: string;
  };
  roles: RolesEnum[];
  stores: string[];
  products: ProductType[];
};

export type ConfigKeysTypes = {
  environment: string;
  jwtSecret: string;
  melonnApiUrl: string;
  melonnApiKey: string;
};

export type ConfigAppTypes = {
  name: string;
  cookieSessionSecret: string;
  port: number;
};

export type ConfigTypes = {
  app: ConfigAppTypes;
  keys: ConfigKeysTypes;
  database: ConfigDatabaseTypes;
};

const config: ConfigTypes = {
  app: {
    cookieSessionSecret:
      process.env.APP_COOKIE_SECRET_SESSION || 'COOKIE_SESSION_SECRET',
    name: process.env.APP_NAME || 'Meloon API',
    port: Number(process.env.PORT) || 4000,
  },
  keys: {
    environment: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || '',
    melonnApiUrl: process.env.MEONN_API_URL || '',
    melonnApiKey: process.env.MEONN_API_KEY || '',
  },
  database: {
    settings: {
      uri: process.env.DATABASE_URI || '',
      name: process.env.DATABASE_NAME || '',
    },
    stores: [
      'Exito',
      'Metro',
      'Daffiti',
      'Jumbo',
      'Falabella',
      'Studio F',
      'Apple',
      'Microsoft',
      'Samsung',
    ],
    roles: [
      RolesEnum.USER,
      RolesEnum.DELIVERY,
      RolesEnum.SELLER,
      RolesEnum.MODERATOR,
      RolesEnum.ADMIN,
      RolesEnum.SUPER_ADMIN,
    ],
    products: [
      {
        name: "Tecno Camon 16 Premier Dual SIM 128 GB plata glacial 8 GB RAM",
        photo: "https://http2.mlstatic.com/D_NQ_NP_777565-MLA45043858556_032021-O.webp",
        quantity: 10,
        weight: 1.1,
        price: 860,
      },
      {
        name: "Apple iPad Pro (2021) 12,9 Chip M1 - 128 Gb + Wifi, Sellado",
        photo: "https://http2.mlstatic.com/D_NQ_NP_2X_967216-MCO45779750943_052021-F.webp",
        quantity: 10,
        weight: 1.1,
        price: 1200,
      },
      {
        name: "Apple Macbook Pro 2020 13 M1 16gb 256gb",
        photo: "https://http2.mlstatic.com/D_NQ_NP_2X_722440-MCO44238609025_122020-F.webp",
        quantity: 10,
        weight: 1.1,
        price: 1650,
      },
      {
        name: "Campana Extractora Challenger 80cm 3vel Acero Inox Cx 4880",
        photo: "https://http2.mlstatic.com/D_NQ_NP_797174-MCO43300804676_082020-O.webp",
        quantity: 10,
        weight: 1.1,
        price: 500,
      },
    ]
  },
};

export default config;
