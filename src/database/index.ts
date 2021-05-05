import mongoose from 'mongoose';
import { Logger } from 'winston';

import { ConfigDatabaseTypes } from 'config';
import { ProductModel, RoleModel, StoreModel } from 'models';

import { logger, printHeader, RolesEnum } from 'utils';

export type DatabasePropTypes = {
  uri: string;
};

export type ProductType = {
  name: string;
  photo: string;
  quantity: number;
  weight: number;
  price: number;
};

export type DatabaseSettingsTypes = {
  useCreateIndex: boolean;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  useFindAndModify: boolean;
};

export type DatabaseConnectPropTypes = () => Promise<void>;

export type DatabaseSetupPropTypes = (
  settings: ConfigDatabaseTypes,
) => Promise<void>;

export default class Database {
  protected uri: string = '';
  protected databaseLogger: Logger = logger('database', '💾');

  private settings: DatabaseSettingsTypes = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  };

  constructor({ uri }: DatabasePropTypes) {
    this.uri = uri;
  }

  public connect: DatabaseConnectPropTypes = async () => {
    try {
      await mongoose.connect(this.uri, this.settings);

      printHeader('| The connection to the database was successful. |');
      this.databaseLogger.info(
        'The connection to the database was successful.',
      );
    } catch (error) {
      this.databaseLogger.info('The connection to the database failed.');
      this.databaseLogger.error(error.message);
      printHeader('| The connection to the database failed. |');
    }
  };

  public setup: DatabaseSetupPropTypes = async (settings) => {
    this.databaseLogger.info(
      'Verifying essential information in the database, please wait a few seconds.',
    );

    await this.setupRoles(settings.roles);
    await this.setupStores(settings.stores);
    await this.setupProducts(settings.products);

    this.databaseLogger.info('Verification completed, Thank you for waiting.');
  };

  private setupRoles = async (roles: RolesEnum[]): Promise<void> => {
    for (const role of roles) {
      try {
        const roleAlreadyExists: any = await RoleModel.findOne({ name: role });

        if (!!roleAlreadyExists?._id) continue;

        await new RoleModel({ name: role }).save();

        this.databaseLogger.info(`Role ${role} added to the database.`);
      } catch (error) {
        this.databaseLogger.error(error.message);
      }
    }
  };

  private setupStores = async (stores: string[]): Promise<void> => {
    for (const store of stores) {
      try {
        const storeAlreadyExists: any = await StoreModel.findOne({
          name: store,
        });

        if (!!storeAlreadyExists?._id) continue;

        await new StoreModel({ name: store }).save();

        this.databaseLogger.info(`Store ${store} added to the database.`);
      } catch (error) {
        this.databaseLogger.error(error.message);
      }
    }
  };

  private setupProducts = async (products: ProductType[]): Promise<void> => {
    for (const product of products) {
      try {
        const productAlreadyExists: any = await ProductModel.findOne({
          name: product.name,
        });

        if (!!productAlreadyExists?._id) continue;

        await new ProductModel(product).save();

        this.databaseLogger.info(
          `Store ${product.name} added to the database.`,
        );
      } catch (error) {
        this.databaseLogger.error(error.message);
      }
    }
  };
}
