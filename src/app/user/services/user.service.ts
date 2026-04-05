import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
DeepPartial,
FindOptionsWhere,
Repository,
UpdateResult,
} from 'typeorm';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {  UpdateProfileDto } from '../dto/update-profile.dto';
import { Treatment } from '../../../shared/entities/treatment.entity';
import { Ward } from '../../../shared/entities/ward.entity';
import { Team } from '../../../shared/entities/team.entity';
import { Transfer } from '../../../shared/entities/transfer.entity';
import { Admission } from '../../../shared/entities/admission.entity';

@Injectable()
export class UserService {
constructor(
@InjectRepository(User) private readonly userRepository: Repository<User>,
@InjectRepository(Treatment) private readonly treatmentRepository: Repository<Treatment>,
@InjectRepository(Ward) private readonly wardRepository: Repository<Ward>,
@InjectRepository(Team) private readonly teamRepository: Repository<Team>,
@InjectRepository(Transfer) private readonly transferRepository: Repository<Transfer>,
@InjectRepository(Admission) private readonly admissionRepository: Repository<Admission>

) {}

public async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
return await this.userRepository.findOne({ where });
}


public async create(data: DeepPartial<User>): Promise<User> {
const user: User = await this.userRepository.create(data);
return await this.userRepository.save(user);
}

public async update(
where: FindOptionsWhere<User>,
data: QueryDeepPartialEntity<User>,
): Promise<UpdateResult> {
return await this.userRepository.update(where, data);
}

public async exists(where: FindOptionsWhere<User>): Promise<boolean> {
const user: boolean = await this.userRepository.existsBy(where);

return user;
}

public async profile(user: User) {
return user; 
}


public async changePassword(
  data: ChangePasswordDto,
  user: User,
): Promise<{ message: string }> {

  const foundUser = await this.userRepository.findOne({
    where: { id: user.id },
    select: ['id', 'password'],
  });

  if (!foundUser) {
    throw new BadRequestException('User not found.');
  }

  const isCurrentPasswordValid = await bcryptjs.compare(
    data.currentPassword,
    foundUser.password,
  );

  if (!isCurrentPasswordValid) {
    throw new BadRequestException(
      'Current password is incorrect.',
    );
  }

  const hashedNewPassword = await bcryptjs.hash(data.newPassword, 10);

  await this.userRepository.update(foundUser.id, {
    password: hashedNewPassword,
  });

  return { message: 'Password updated successfully' };
}



public async updateProfile(
data: UpdateProfileDto,
user: User,
): Promise<{ message: string; user: User }> {
const dataToUpdate: Partial<User> = {
firstname: data.firstname,
lastname: data.lastname,
dob: data.dob,
phonenumber: data.phonenumber,
gender: data.gender,
};
Object.assign(user, dataToUpdate);

await this.userRepository.save(user);

return {
message: 'Profile updated successfully',
user,
};
}



async getCurrentUserTreatments(
  user: User,
): Promise<{ treatments: Treatment[] }> {
  // Ensure user is a patient
  if (user.role !== UserRole.PATIENT) {
    throw new BadRequestException('Only patients have treatments.');
  }
  const treatments = await this.treatmentRepository.find({
    where: { patient: { id: user.id } }
  });
  return { treatments };
}


async getCurrentUserTransfers(
  user: User,
): Promise<{ transfers: Transfer[] }> {
  // Ensure user is a patient
  if (user.role !== UserRole.PATIENT) {
    throw new BadRequestException('Only patients have transfers.');
  }
  const transfers = await this.transferRepository.find({
    where: { patient: { id: user.id } }
  });
  return { transfers };
}


async getCurrentUserAdmissions(
  user: User,
): Promise<{ admissions: Admission[] }> {
  // Ensure user is a patient
  if (user.role !== UserRole.PATIENT) {
    throw new BadRequestException('Only patients have admissions.');
  }
  const admissions = await this.admissionRepository.find({
    where: { patient: { id: user.id } }
  });
  return { admissions };
}


async getCurrentUserWard(user: User): Promise<{ ward: Ward[] }> {
  if (user.role !== UserRole.PATIENT) {
    throw new BadRequestException('Only patients have wards.');
  }

  const ward = await this.wardRepository.find({
    where: { patients: { id: user.id } },
    relations: ['patients'],
  });

  return { ward };
}


async getCurrentUserDischarges(user: User) {
  const discharges = await this.admissionRepository
    .createQueryBuilder('admission')
    .leftJoin('admission.patient', 'patient')
    .select([
      'admission.dischargedAt AS dischargedAt',
      'admission.dischargeReason AS dischargeReason',
    ])
    .where('patient.id = :userId', { userId: user.id })
    .andWhere('admission.dischargedAt IS NOT NULL')
    .orderBy('admission.dischargedAt', 'DESC')
    .getRawMany();

  return {
    message: 'User discharge history retrieved successfully.',
    data: discharges.map((item) => ({
      dischargedAt: item.dischargedAt,
      dischargeReason: item.dischargeReason,
    })),
  };
}

async getCurrentUserTeam(user: User): Promise<{ team: Team[] }> {
  if (user.role !== UserRole.DOCTOR && user.role !== UserRole.NURSE) {
    throw new BadRequestException('Only doctor or nurse have team.');
  }

  const team = await this.teamRepository.find({
    where: { users: { id: user.id } },
    relations: ['users'],
  });

  return { team };
}


}    
