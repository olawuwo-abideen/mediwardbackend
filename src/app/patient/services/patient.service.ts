import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository,  } from '@nestjs/typeorm';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { Admission, PatientStatus } from '../../../shared/entities/admission.entity';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { ILike, Repository, DataSource } from 'typeorm';
import { AdmitPatientDto } from '../dto/patient.dto';
import { Ward } from 'src/shared/entities/ward.entity';

@Injectable()
export class PatientService {
    @InjectDataSource()
    private readonly dataSource: DataSource
@InjectRepository(User) private readonly userRepository: Repository<User>
@InjectRepository(Admission) private readonly admissionRepository: Repository<Admission>
@InjectRepository(Ward) private readonly wardRepository: Repository<Ward>



public async getAllPatients(pagination: PaginationDto): Promise<{
message: string;
data: User[];
currentPage: number;
totalPages: number;
totalItems: number;
}> {
const { page = 1, pageSize = 10 } = pagination;

const [data, total] = await this.userRepository.findAndCount({
where: { role: UserRole.PATIENT },
skip: (page - 1) * pageSize,
take: pageSize,
});

return {
message: 'Patients retrieved successfully',
data,
currentPage: page,
totalPages: Math.ceil(total / pageSize),
totalItems: total,
};
}


async searchPatientsByName(
search: string,
pagination: PaginationDto,
): Promise<{
message: string;
data: User[];
currentPage: number;
totalPages: number;
totalItems: number;
}> {
const { page = 1, pageSize = 10 } = pagination;
const skip = (page - 1) * pageSize;

const [patients, total] = await this.userRepository.findAndCount({
where: [
{ role: UserRole.PATIENT, firstname: ILike(`%${search}%`) },
{ role: UserRole.PATIENT, lastname: ILike(`%${search}%`) },
],
skip,
take: pageSize,
});

return {
message: 'Patients search completed',
data: patients,
currentPage: page,
totalPages: Math.ceil(total / pageSize),
totalItems: total,
};
}


public async getPatient(id: string): Promise<{ message: string; patient: User }> {
const patient = await this.userRepository.findOne({ where: { id } });
if (!patient) {
throw new NotFoundException(`Patient not found`);
}
return { message: 'Patient retrieved successfully', patient };
}


async admitPatient(
  patientId: string,
  admitPatientDto: AdmitPatientDto,
): Promise<{ message: string }> {
  const { wardId, reasonforadmission } = admitPatientDto;

  return await this.dataSource.transaction(async (manager) => {
    // 1. Find patient
    const patient = await manager.findOne(User, {
      where: { id: patientId },
    });
console.log(this.dataSource);
    if (!patient) {
      throw new NotFoundException('Patient not found.');
    }

    // 2. Check active admission
    const active = await manager.findOne(Admission, {
      where: {
        patient: { id: patientId },
        isAdmitted: true,
      },
    });

    if (active) {
      throw new BadRequestException('Patient is already admitted.');
    }

    // 3. Find ward
    const ward = await manager.findOne(Ward, {
      where: { id: wardId },
    });

    if (!ward) {
      throw new NotFoundException('Ward not found.');
    }

    // 4. Check capacity
    if (ward.currentoccupancy >= ward.totaloccupancy) {
      throw new BadRequestException('Ward is full.');
    }

    // 5. Assign patient to ward
    patient.ward = ward;
    await manager.save(patient);

    // 6. Create admission
    const admission = manager.create(Admission, {
      patient,
      isAdmitted: true,
      admittedAt: new Date(),
      reasonforadmission,
    });

    await manager.save(admission);

    // 7. Increment occupancy
    ward.currentoccupancy += 1;
    await manager.save(ward);

    return { message: 'Patient admitted successfully.' };
  });
}


async dischargePatient(patientId: string): Promise<{ message: string }> {
  const patient = await this.userRepository.findOne({ where: { id: patientId } });

  if (!patient) {
    throw new NotFoundException(`Patient not found.`);
  }

  const admission = await this.admissionRepository.findOne({
    where: { patient: { id: patientId }, isAdmitted: true },
  });

  if (!admission) {
    throw new NotFoundException('Patient is not currently admitted.');
  }

  admission.isAdmitted = false;
  admission.dischargedAt = new Date();
  await this.admissionRepository.save(admission);

  return { message: 'Patient discharged successfully.' };
}

async getAdmissionHistory(patientId: string): Promise<{ message: string; history: { admittedAt: Date; dischargedAt: Date | null }[] }> {
  const patient = await this.userRepository.findOne({ where: { id: patientId } });

  if (!patient) {
    throw new NotFoundException(`Patient with ID ${patientId} not found.`);
  }

  const admissions = await this.admissionRepository.find({
    where: { patient: { id: patientId } },
    order: { admittedAt: 'DESC' },
    select: ['admittedAt', 'dischargedAt'], // Only retrieve relevant fields
  });

  const history = admissions.map(adm => ({
    admittedAt: adm.admittedAt,
    dischargedAt: adm.dischargedAt || null,
  }));

  return {
    message: 'Admission history retrieved successfully.',
    history,
  };
}

async getCurrentStatus(patientId: string): Promise<{ message: string; status: PatientStatus }> {
  const patient = await this.userRepository.findOne({ where: { id: patientId } });
  if (!patient) {
    throw new NotFoundException(`Patient with ID ${patientId} not found.`);
  }
  const active = await this.admissionRepository.findOne({
    where: { patient: { id: patientId }, isAdmitted: true },
  });
  const status = active ? PatientStatus.IN_PATIENT : PatientStatus.OUT_PATIENT;
  return {
    message: `Patient is currently an ${status.replace('_', ' ').toLowerCase()}.`,
    status,
  };
}











}



