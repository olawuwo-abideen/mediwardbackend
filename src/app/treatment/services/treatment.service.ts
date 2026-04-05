import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Treatment } from '../../../shared/entities/treatment.entity';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTreatmentDto, UpdateTreatmentDto } from '../dto/treatment.dto';

@Injectable()
export class TreatmentService {
@InjectRepository(User) private readonly userRepository: Repository<User>
@InjectRepository(Treatment) private readonly treatmentRepository: Repository<Treatment>



async createTreatment(
  patientId: string,
  admitPatientDto: CreateTreatmentDto,
): Promise<{ message: string; treatment: Treatment }> {
  const patient = await this.userRepository.findOne({
    where: { id: patientId },
  });

  if (!patient) {
    throw new NotFoundException('Patient not found.');
  }

  if (patient.role !== UserRole.PATIENT) {
    throw new BadRequestException('User is not a patient.');
  }

  const treatment = this.treatmentRepository.create({
    symptoms: admitPatientDto.symptoms,
    diagnosis: admitPatientDto.diagnosis,
    medication: admitPatientDto.medication,
    patient: patient
  });

  const savedTreatment = await this.treatmentRepository.save(treatment);

  return {
    message: 'Patient treatment created successfully.',
    treatment: savedTreatment,
  };
}




async getPatientRecord(
  patientId: string,
): Promise<{ patient: User; treatments: Treatment[] }> {
  const patient = await this.userRepository.findOne({
    where: { id: patientId },
  });

  if (!patient) {
    throw new NotFoundException('Patient not found.');
  }

  if (patient.role !== UserRole.PATIENT) {
    throw new BadRequestException('User is not a patient.');
  }

  const treatments = await this.treatmentRepository.find({
    where: { patient: { id: patientId } },
    relations: ['patient'], 
  });

  return {
    patient,
    treatments,
  };
}





    
}
