import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UserModule } from '../../../app/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User])],
})
export class ValidatorModule {}
