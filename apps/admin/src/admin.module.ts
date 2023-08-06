import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminSchemaModule } from './admin/admin.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from './notfound.filter';
import { AppService } from './admin.service';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD')
          }

        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}`
        },
        template: {
          dir: join(__dirname, '..', '..', '..', '/apps/admin/views/mails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    AuthModule, AdminSchemaModule, CourseModule
  ],
  
  controllers: [AdminController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter, // Sử dụng NotFoundFilter để xử lý NotFoundException
    },
  ],
})
@Module({})
export class AppModule {
}
