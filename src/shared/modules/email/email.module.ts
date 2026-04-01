// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';
// import { UserModule } from '../../../app/user/user.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../../../shared/entities/user.entity';
// import { EmailService } from './email.service';

// @Module({
//   imports: [
//     JwtModule,
//     ConfigModule,
//     UserModule,
//     TypeOrmModule.forFeature([User]),
//     MailerModule.forRootAsync({
//       useFactory: async (config: ConfigService) => ({
//         transport: {
//           host: config.get('MAIL_HOST'),
//           auth: {
//             user: config.get('MAIL_USERNAME'),
//             pass: config.get('MAIL_PASSWORD'),
//           },
          
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [EmailService],
//   exports: [EmailService],
// })
// export class EmailModule {}



import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), // needed if EmailService uses jwtService
    TypeOrmModule.forFeature([User]),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}