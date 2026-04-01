import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../shared/services/typeorm/typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AvailabilitySlotModule } from './availabilityslot/availabilityslot.module';
import { WardModule } from './ward/ward.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { TreatmentModule } from './treatment/treatment.module';

@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
}),
ThrottlerModule.forRoot([
{
ttl: 60000,
limit: 10,
},
]),
TypeOrmModule.forRootAsync({
useClass: TypeOrmConfigService,
}),
AuthModule,
UserModule,
AdminModule,  
PatientModule, 
AppointmentModule, 
AvailabilitySlotModule, 
WardModule, 
TransferModule, 
TreatmentModule
],
controllers: [],
providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
],
})
export class AppModule {}
