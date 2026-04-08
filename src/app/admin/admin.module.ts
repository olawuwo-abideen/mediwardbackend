import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../../shared/entities/admin.entity';
import { User } from '../../shared/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Ward } from '../../shared/entities/ward.entity';
import { WardModule } from '../ward/ward.module';
import { AdminAuthGuard } from './guards/adminguard';
import { Admission } from '../../shared/entities/admission.entity';
import { Appointment } from '../../shared/entities/appointment.entity';
import { PassportModule } from '@nestjs/passport';
import { Team } from '../../shared/entities/team.entity';
import { Transfer } from '../../shared/entities/transfer.entity';
import { Verification } from '../../shared/entities/verification.entity';

@Module({
imports: [
JwtModule.registerAsync({
inject: [ConfigService],
useFactory: async (configService: ConfigService) => ({
secret: configService.get<string>('JWT_SECRET'),
signOptions: {
expiresIn: `${configService.get<string>('JWT_EXPIRES_IN')}`,
},
}),
}),
TypeOrmModule.forFeature([Admin, User, Ward, Admission, Appointment, Team, Transfer, Verification]),
PassportModule,
UserModule,
ConfigModule,
WardModule,
UserModule
],
controllers: [AdminController],
providers: [
AdminService,
AdminAuthGuard
]
})
export class AdminModule {}
