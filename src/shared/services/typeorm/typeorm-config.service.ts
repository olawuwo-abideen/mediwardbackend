import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { isDevelopment, isProduction } from '../../utils/helpers.util'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let synchronize = true;

    if (isDevelopment()) {
      synchronize = true;
    }

    if (isProduction()) {
      synchronize = false;
    }

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
  //       ssl: {
  //   rejectUnauthorized: false,
  // },
      autoLoadEntities: true,
      synchronize
    };
  }
}


   