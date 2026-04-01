import { Module } from '@nestjs/common';
import { WardController } from './controllers/ward.controller';
import { WardService } from './services/ward.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../../shared/entities/user.entity';
import { Ward } from '../../shared/entities/ward.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
imports: [
PassportModule,
TypeOrmModule.forFeature([ User, Ward]),
JwtModule.register({}),
UserModule,
AuthModule
],
controllers: [WardController],
providers: [WardService]
})
export class WardModule {}
