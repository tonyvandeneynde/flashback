import { Logger, Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import dataSource from './ormconfig';
import { DATABASE_CONNECTION, REPOS } from './constants';
import { Image, Tag } from './entities';

export const databaseProviders: Provider<unknown>[] = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async () => {
      return dataSource
        .initialize()
        .then((database) => {
          Logger.log('🚀 Database connected');
          return database;
        })
        .catch((reason) => {
          Logger.error(
            `💥 Failed to connect to database: ${JSON.stringify(reason)}`,
          );
          throw reason;
        });
    },
  },
  {
    provide: REPOS.Image,
    useFactory: (dataSource: DataSource): Repository<Image> =>
      dataSource.getRepository(Image),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: REPOS.Tag,
    useFactory: (dataSource: DataSource): Repository<Tag> =>
      dataSource.getRepository(Tag),
    inject: [DATABASE_CONNECTION],
  },
];
