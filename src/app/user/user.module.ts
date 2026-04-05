import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../shared/entities/user.entity';
import { Appointment } from '../../shared/entities/appointment.entity';
import { PassportModule } from '@nestjs/passport';
import { Treatment } from '../../shared/entities/treatment.entity';
import { Team } from '../../shared/entities/team.entity';
import { Ward } from '../../shared/entities/ward.entity';
import { Transfer } from '../../shared/entities/transfer.entity';
import { Admission } from '../../shared/entities/admission.entity';

@Module({
  imports: [
TypeOrmModule.forFeature([User, Appointment, Treatment, Team, Ward,Transfer, Admission]),
forwardRef(() => AuthModule),
JwtModule,
PassportModule
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
