import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from '../../../shared/entities/transfer.entity';
import { CreateTransferDto } from '../dto/transfer.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { Ward } from '../../../shared/entities/ward.entity';
import { DataSource, Repository } from 'typeorm';
import { Admission } from '../../../shared/entities/admission.entity';

@Injectable()
export class TransferService {
constructor(
@InjectRepository(Transfer)
private readonly transferRepository: Repository<Transfer>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
@InjectRepository(Ward)
private readonly wardRepository: Repository<Ward>,
@InjectRepository(Admission)
private readonly admissionRepository: Repository<Admission>,
private readonly dataSource: DataSource,
) {}


private async getActiveAdmission(patientId: string): Promise<Admission> {
  const admission = await this.admissionRepository
    .createQueryBuilder('admission')
    .leftJoinAndSelect('admission.patient', 'patient')
    .leftJoinAndSelect('admission.ward', 'ward')
    .where('patient.id = :patientId', { patientId })
    .andWhere('admission.isAdmitted = :isAdmitted', { isAdmitted: true })
    .getOne();

  if (!admission) {
    throw new BadRequestException('Patient is not currently admitted.');
  }

  return admission;
}

async createTransfer(
  user: User,
  dto: CreateTransferDto
): Promise<{ message: string; transfer: Transfer }> {
  if (user.role !== UserRole.DOCTOR) {
    throw new BadRequestException('Only doctors can transfer patients');
  }

  const patient = await this.userRepository.findOne({
    where: { id: dto.patientId, role: UserRole.PATIENT },
    relations: ['ward'],
  });

  if (!patient) {
    throw new NotFoundException('Patient not found');
  }

  const activeAdmission = await this.getActiveAdmission(dto.patientId);

  const oldWard = activeAdmission.ward;

  const newWard = await this.wardRepository.findOne({
    where: { id: dto.transferto },
  });

  if (!newWard) {
    throw new NotFoundException('Ward not found');
  }

  if (oldWard && oldWard.id === newWard.id) {
    throw new BadRequestException('Patient is already in this ward');
  }

  if ((newWard.bedoccupancy ?? 0) >= (newWard.bedcapacity ?? 0)) {
    throw new BadRequestException('Selected ward is already full');
  }

  const transfer = this.transferRepository.create({
    patient,
    transferto: newWard.name,
    reason: dto.reason,
  });

  const saved = await this.transferRepository.save(transfer);

  if (oldWard) {
    oldWard.bedoccupancy = Math.max((oldWard.bedoccupancy ?? 0) - 1, 0);
    await this.wardRepository.save(oldWard);
  }

  newWard.bedoccupancy = (newWard.bedoccupancy ?? 0) + 1;
  await this.wardRepository.save(newWard);

  patient.ward = newWard;
  await this.userRepository.save(patient);

  activeAdmission.ward = newWard;
  await this.admissionRepository.save(activeAdmission);

  return {
    message: 'Patient transferred successfully',
    transfer: saved,
  };
}
async getTransfers(): Promise<{ message: string; transfers: Transfer[] }> {
const transfers = await this.transferRepository.find({ relations: ['patient'] });
return { message: transfers.length ? 'Transfers retrieved' : 'No transfers found', transfers };
}
}