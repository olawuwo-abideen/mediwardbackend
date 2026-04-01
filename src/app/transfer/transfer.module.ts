import { Module } from '@nestjs/common';
import { TransferService } from './services/transfer.service';
import { TransferController } from './controllers/transfer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from 'src/shared/entities/ward.entity';
import { User } from 'src/shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Transfer } from 'src/shared/entities/transfer.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([Ward, User, Transfer]),
  JwtModule.register({}),
  UserModule,
  AuthModule,
  PassportModule
  ],
  providers: [TransferService],
  controllers: [TransferController]
})
export class TransferModule {}
