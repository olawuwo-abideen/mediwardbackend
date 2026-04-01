import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { User } from '../../shared/entities/user.entity';
import { Appointment } from '../../shared/entities/appointment.entity';
import { AvailabilitySlot } from '../../shared/entities/availabilityslot.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../../shared/modules/email/email.module';

@Module({
imports: [
TypeOrmModule.forFeature([Appointment, User, AvailabilitySlot]),
JwtModule.register({}),
UserModule,
AuthModule,
PassportModule,
EmailModule
],
controllers: [AppointmentController],
providers: [AppointmentService],
})
export class AppointmentModule {}

