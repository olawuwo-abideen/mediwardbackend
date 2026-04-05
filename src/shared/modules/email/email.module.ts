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