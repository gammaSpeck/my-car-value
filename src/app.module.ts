import { APP_PIPE } from '@nestjs/core';

import {
  MiddlewareConsumer,
  Module,
  Provider,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

/** This is imported like this just because of our custom TS config */
const cookieSession = require('cookie-session');

const GlobalValidationPipe: Provider = {
  provide: APP_PIPE,
  useValue: new ValidationPipe({ whitelist: true }),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRoot(),

    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
    //     type: 'sqlite',
    //     database: config.get<string>('DB_NAME'),
    //     entities: [User, Report],
    //     // entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: true,
    //   }),
    // }),

    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, GlobalValidationPipe],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({ keys: [this.configService.get<string>('COOKIE_KEY')] }),
      )
      .forRoutes('*');
  }
}
