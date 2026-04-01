import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../shared/entities/user.entity';
import { Appointment } from '../../shared/entities/appointment.entity';
import { PassportModule } from '@nestjs/passport';
import { Treatment } from 'src/shared/entities/treatment.entity';
import { Team } from 'src/shared/entities/team.entity';
import { Ward } from 'src/shared/entities/ward.entity';

@Module({
  imports: [
TypeOrmModule.forFeature([User, Appointment, Treatment, Team, Ward]),
forwardRef(() => AuthModule),
JwtModule,
PassportModule
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
