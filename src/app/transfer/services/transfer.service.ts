import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from '../../../shared/entities/transfer.entity';
import { CreateTransferDto } from '../dto/transfer.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { Ward } from '../../../shared/entities/ward.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

async createTransfer(
  user: User,
  dto: CreateTransferDto
): Promise<{ message: string; transfer: Transfer }> {

  // Only doctors can transfer patients
  if (user.role !== UserRole.DOCTOR) throw new NotFoundException('Only doctors can transfer patients');

  // Fetch patient with current ward
  const patient = await this.userRepository.findOne({
    where: { id: dto.patientId, role: UserRole.PATIENT },
    relations: ['ward'],
  });
  if (!patient) throw new NotFoundException('Patient not found');

  // Check target ward exists (by ID)
  const newWard = await this.wardRepository.findOne({ where: { id: dto.transferto } });
  if (!newWard) throw new NotFoundException('Ward not found');

  // Create transfer record
  const transfer = this.transferRepository.create({
    patient,
    transferto: newWard.name, // optional: store ward name in transfer
  });

  const saved = await this.transferRepository.save(transfer);

  // Update patient current ward
  patient.ward = newWard;
  await this.userRepository.save(patient);

  return { message: 'Patient transferred successfully', transfer: saved };
}


  async getTransfers(): Promise<{ message: string; transfers: Transfer[] }> {
    const transfers = await this.transferRepository.find({ relations: ['patient'] });
    return { message: transfers.length ? 'Transfers retrieved' : 'No transfers found', transfers };
  }
}