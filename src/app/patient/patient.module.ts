import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Admission } from '../../shared/entities/admission.entity';
import { PassportModule } from '@nestjs/passport';
import { Ward } from 'src/shared/entities/ward.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([ User, Admission, Ward]),
  JwtModule.register({}),
  UserModule,
  AuthModule,
  PassportModule
  ],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
