  import { Module } from '@nestjs/common';
  import { AvailabilitySlotController } from './controllers/availabilityslot.controller';
  import { AvailabilitySlotService } from './services/availabilityslot.service';
  import { User } from '../../shared/entities/user.entity';
  import { AvailabilitySlot } from '../../shared/entities/availabilityslot.entity';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { JwtModule } from '@nestjs/jwt';
  import { UserModule } from '../user/user.module';
  import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

  @Module({
  imports: [
  TypeOrmModule.forFeature([User, AvailabilitySlot]),
  PassportModule,
  JwtModule.register({}),
  UserModule,
  AuthModule
  ],
  controllers: [AvailabilitySlotController],
  providers: [AvailabilitySlotService]
  })
  export class AvailabilitySlotModule {}
