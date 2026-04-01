import { Module } from '@nestjs/common';
import { TreatmentController } from './controllers/treatment.controller';
import { TreatmentService } from './services/treatment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Treatment } from 'src/shared/entities/treatment.entity';



@Module({
  imports: [
  TypeOrmModule.forFeature([ User, Treatment]),
  JwtModule.register({}),
  UserModule,
  AuthModule,
  PassportModule
  ],
  controllers: [TreatmentController],
  providers: [TreatmentService]
})
export class TreatmentModule {}
