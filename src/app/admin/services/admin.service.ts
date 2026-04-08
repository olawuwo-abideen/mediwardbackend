import {
BadRequestException,
ConflictException,
Injectable,
NotFoundException,
OnModuleInit,
UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../../../shared/entities/admin.entity';
import { Between, DataSource, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Team } from '../../../shared/entities/team.entity';
import { Ward } from '../../../shared/entities/ward.entity';
import { CreateWardDto, UpdateWardDto } from '../../../app/ward/dto/ward.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { Admission } from '../../../shared/entities/admission.entity';
import { Appointment } from '../../../shared/entities/appointment.entity';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';
import { Transfer } from 'src/shared/entities/transfer.entity';
import { Verification } from 'src/shared/entities/verification.entity';



@Injectable()
export class AdminService implements OnModuleInit {
constructor(
@InjectRepository(Admin)
private readonly adminRepository: Repository<Admin>,
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
@InjectRepository(Team)
private teamRepository: Repository<Team>,
@InjectRepository(Ward)
private wardRepository: Repository<Ward>,
@InjectRepository(User) 
private readonly userRepository: Repository<User>,
@InjectRepository(Admission) 
private readonly admissionRepository: Repository<Admission>,
@InjectRepository(Appointment) 
private readonly appointmentRepository: Repository<Appointment>,
@InjectRepository(Transfer)
private readonly transferRepository: Repository<Transfer>,
@InjectRepository(Verification)
private readonly verificationRepository: Repository<Verification>,
private readonly dataSource: DataSource,
) {}

async onModuleInit() {
const email = this.configService.get<string>('ADMIN_EMAIL');
const password = this.configService.get<string>('ADMIN_PASSWORD');

if (!email || !password) {
throw new Error('Email or password is incorrect');
}

if (!(await this.adminRepository.exists({ where: { email } }))) {
const hashedPassword = await bcrypt.hash(password, 10);
await this.adminRepository.save({
email,
password: hashedPassword,
});
}
} 

public async findOne(where: FindOptionsWhere<Admin>): Promise<Admin | null> {
return await this.adminRepository.findOne({ where });
}

public async login({ email, password }: AdminLoginDto) {
const admin = await this.adminRepository.findOne({ where: { email } });
if (!admin || !(await bcrypt.compare(password, admin.password))) {
throw new UnauthorizedException('Email or password is incorrect');
}
return {
token: this.createAccessToken(admin)
};
}

public createAccessToken(admin: Admin): string {
return this.jwtService.sign({ sub: admin.id, role: 'admin' });
}

// role: 'admin'


async getAdmissions() {
  const admissions = await this.admissionRepository
    .createQueryBuilder('admission')
    .leftJoin('admission.patient', 'patient')
    .select([
      'admission.id AS admissionId',
      'admission.reasonforadmission AS reasonforadmission',
      'admission.admittedAt AS admissionDate',
      'patient.firstname AS patientFirstname',
      'patient.lastname AS patientLastname',
    ])
    .orderBy('admission.admittedAt', 'DESC')
    .getRawMany();

  return {
    message: 'All admissions fetched successfully',
    count: admissions.length,
    data: admissions.map((item) => ({
      admissionId: item.admissionId,
      Firstname: item.patientFirstname,
      Lastname: item.patientLastname,
      reasonforadmission: item.reasonforadmission,
      admissionDate: item.admissionDate,
    })),
  };
}

// async getMonthlyAdmissions(month: number, year: number) {
// const from = new Date(year, month - 1, 1);
// const to = new Date(year, month, 0, 23, 59, 59);

// const data = await this.admissionRepository.find({ where: { createdAt: Between(from, to) } });
// return { message: 'Monthly admissions fetched', count: data.length, data };
// }

// async getYearlyAdmissions(year: number) {
// const from = new Date(year, 0, 1);
// const to = new Date(year, 11, 31, 23, 59, 59);

// const data = await this.admissionRepository.find({ where: { createdAt: Between(from, to) } });
// return { message: 'Yearly admissions fetched', count: data.length, data };
// }

async getDischargeSummary() {
  const discharges = await this.admissionRepository
    .createQueryBuilder('admission')
    .leftJoin('admission.patient', 'patient')
    .select([
      'admission.id AS admissionId',
      'admission.dischargedAt AS dischargeDate',
      'patient.firstname AS patientFirstname',
      'patient.lastname AS patientLastname',
    ])
    .where('admission.dischargedAt IS NOT NULL')
    .orderBy('admission.dischargedAt', 'DESC')
    .getRawMany();

  return {
    message: 'Discharge summary fetched',
    count: discharges.length,
    data: discharges.map((item) => ({
      admissionId: item.admissionId,
      Firstname: item.patientFirstname,
      Lastname: item.patientLastname,
      dischargeDate: item.dischargeDate,
    })),
  };
}


async getAppointmentsPerDoctor() {
  const stats = await this.appointmentRepository
    .createQueryBuilder('appointment')
    .leftJoin('appointment.doctor', 'doctor')
    .select([
      'doctor.firstname AS firstname',
      'doctor.lastname AS lastname',
      'COUNT(appointment.id) AS total',
    ])
    .addGroupBy('doctor.firstname')
    .addGroupBy('doctor.lastname')
    .getRawMany();

  return {
    message: 'Appointments per doctor',
    stats: stats.map((item) => ({
      doctorId: item.doctorId,
      firstname: item.firstname,
      lastname: item.lastname,
      total: Number(item.total),
    })),
  };
}


public async getAllStaffs(pagination: PaginationDto): Promise<{ message: string; data: User[] }> {
const { page = 1, pageSize = 10 } = pagination;

const staffRoles = [
UserRole.DOCTOR,
UserRole.NURSE,
];

const [data] = await this.userRepository.findAndCount({
where: {
role: In(staffRoles),
},
skip: (page - 1) * pageSize,
take: pageSize,
});

return {
message: 'Staff users retrieved successfully',
data,
};
}

public async countAllDoctors(): Promise<{ message: string; total: number }> {
const doctorRoles = [
UserRole.DOCTOR

];

const total = await this.userRepository.count({
where: {
role: In(doctorRoles),
},
});

return {
message: 'Total number of staff users retrieved successfully',
total,
};
}

public async countAllNurses(): Promise<{ message: string; total: number }> {
const nurseRoles = [
UserRole.NURSE,

];

const total = await this.userRepository.count({
where: {
role: In(nurseRoles),
},
});

return {
message: 'Total number of nurse users retrieved successfully',
total,
};
}

public async countPatients(): Promise<{ message: string; total: number }> {
const patientRoles = [
UserRole.PATIENT,
];

const total = await this.userRepository.count({
where: {
role: In(patientRoles),
},
});

return {
message: 'Total number of patient users retrieved successfully',
total,
};
}



public async getTotalAdmittedPatients(): Promise<{ message: string; totalAdmitted: number }> {
const totalAdmitted = await this.admissionRepository.count({
where: { isAdmitted: true },
});

return {
message: 'Total admitted patients retrieved successfully',
totalAdmitted,
};
}

public async getAllUsers(pagination: PaginationDto): Promise<{ message: string; data: User[] }> {
const { page = 1, pageSize = 10 } = pagination;

const [data] = await this.userRepository.findAndCount({
skip: (page - 1) * pageSize,
take: pageSize,
});

return { message: 'Users retrieved successfully', data };
}




public async getUser(id: string): Promise<{ message: string; user: User }> {
const user = await this.userRepository.findOne({ where: { id } });
if (!user) {
throw new NotFoundException(`User not found`);
}
return { message: 'User retrieved successfully', user };
}


public async deleteUser(params: { id: string }): Promise<{ message: string }> {
  const { id } = params;

  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException(`User not found.`);
  }

  await this.dataSource.transaction(async (manager) => {
    // delete transfer records linked to the user
    await manager
      .createQueryBuilder()
      .delete()
      .from(Transfer)
      .where('patientId = :id', { id })
      .execute();

    // delete verification records linked to the user
    await manager
      .createQueryBuilder()
      .delete()
      .from(Verification)
      .where('userId = :id', { id })
      .execute();

    // finally delete the user
    await manager.delete(User, id);
  });

  return { message: `User deleted successfully.` };
}








public async createWard(
data: CreateWardDto,
): Promise<{ message: string; ward: Ward }> {

const existingWard = await this.wardRepository.findOne({
where: { name: data.name },
});

if (existingWard) {
throw new ConflictException('Ward with this name already exists');
}

const ward = this.wardRepository.create({
name: data.name,
});

const savedWard = await this.wardRepository.save(ward);

return { message: 'Ward created successfully', ward: savedWard };
}

public async updateWard(
id: string,
data: UpdateWardDto,
): Promise<{ message: string; ward: Ward }> {

// 1️⃣ Check if the ward exists
const ward = await this.wardRepository.findOne({ where: { id } });
if (!ward) {
throw new NotFoundException(`Ward not found`);
}

// 2️⃣ If name is being updated, check uniqueness
if (data.name && data.name !== ward.name) {
const existingWard = await this.wardRepository
.createQueryBuilder('ward')
.where('LOWER(ward.name) = LOWER(:name)', { name: data.name })
.andWhere('ward.id != :id', { id }) // exclude current ward
.getOne();

if (existingWard) {
throw new ConflictException('Ward with this name already exists');
}
}

// 3️⃣ Perform the update
await this.wardRepository.update(id, data);

// 4️⃣ Return updated ward
const updatedWard = await this.wardRepository.findOne({ where: { id } });

return { message: 'Ward updated successfully', ward: updatedWard };
}

public async deleteWard(id: string): Promise<{ message: string }> {
const ward = await this.wardRepository.findOne({ where: { id } });
if (!ward) {
throw new NotFoundException(`Ward not found`);
}
await this.wardRepository.delete(id);
return { message: 'Ward deleted successfully' };
}




public async getWards(): Promise<{ message: string; data: Ward[] }> {

const data = await this.wardRepository.find();

return {
message: 'Wards retrieved successfully',
data
};

}

public async searchWards(searchQuery: string | null): Promise<{ message: string; data: Ward[] }> {
let wards: Ward[];

if (!searchQuery) {
// Fetch all wards
wards = await this.wardRepository.find();
} else {
// Fetch all wards matching the search query
wards = await this.wardRepository.find({
where: {
name: ILike(`%${searchQuery}%`),
},
});
}

return { message: 'Wards retrieved successfully', data: wards };
}


public async getTotalNumberOfWards(): Promise<{ message: string; total: number }> {
const total = await this.wardRepository.count();
return { message: 'Total number of wards retrieved successfully', total };
}




public async getWard(id: string): Promise<{ message: string; ward: Ward }> {
  const ward = await this.wardRepository.findOne({
    where: { id },
    relations: ['patients'],
    select: {
      id: true,
      name: true,
      bedoccupancy: true,
      bedcapacity: true,
      createdAt: true,
      updatedAt: true,
      patients: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
      },
    },
  });

  if (!ward) {
    throw new NotFoundException('Ward not found');
  }

  return {
    message: 'Ward retrieved successfully',
    ward,
  };
}


// public async getWard(id: string): Promise<{ message: string; ward: Ward }> {
// const ward = await this.wardRepository.findOne({ where: { id } });
// if (!ward) {
// throw new NotFoundException(`Ward not found`);
// }
// return { message: 'Ward retrieved successfully', ward };
// }






//Team

public async createTeam(
data: CreateTeamDto,
): Promise<{ message: string; team: Team }> {

const existingWard = await this.teamRepository.findOne({
where: { name: data.name },
});

if (existingWard) {
throw new ConflictException('Team with this name already exists');
}

const team = this.teamRepository.create({
name: data.name,
});

const savedTeam = await this.teamRepository.save(team);

return { message: 'Team created successfully', team: savedTeam };
}





public async getTeam(id: string): Promise<{ message: string; team: Team }> {
const team = await this.teamRepository.findOne({
where: { id },
relations: ['users'],
});

if (!team) {
throw new NotFoundException(`Team not found`);
}

return { message: 'Team retrieved successfully', team };
}


public async getTeams(): Promise<{ message: string; data: Team[] }> {

const data = await this.teamRepository.find({
  relations: ['users']
});

return {
message: 'Teams retrieved successfully',
data
};

}


public async deleteTeam(id: string): Promise<{ message: string }> {
const team = await this.teamRepository.findOne({ where: { id } });
if (!team) {
throw new NotFoundException(`Team not found`);
}
await this.teamRepository.delete(id);
return { message: 'Team deleted successfully' };
}




public async updateTeam(
id: string,
data: UpdateTeamDto,
): Promise<{ message: string; team: Team }> {

// 1️⃣ Check if the ward exists
const team = await this.teamRepository.findOne({ where: { id } });
if (!team) {
throw new NotFoundException(`Team not found`);
}

// 2️⃣ If name is being updated, check uniqueness
if (data.name && data.name !== team.name) {
const existingTeam = await this.teamRepository
.createQueryBuilder('team')
.where('LOWER(team.name) = LOWER(:name)', { name: data.name })
.andWhere('team.id != :id', { id }) // exclude current ward
.getOne();

if (existingTeam) {
throw new ConflictException('Team with this name already exists');
}
}

// 3️⃣ Perform the update
await this.teamRepository.update(id, data);

// 4️⃣ Return updated ward
const updatedTeam = await this.teamRepository.findOne({ where: { id } });

return { message: 'Team updated successfully', team: updatedTeam };
}



public async addUserToTeam(
teamId: string,
userId: string,
): Promise<{ message: string; data: Team }> {
const team = await this.teamRepository.findOne({
where: { id: teamId },
relations: ['users'],
});

if (!team) {
throw new NotFoundException('Team not found');
}

const user = await this.userRepository.findOne({
where: { id: userId },
});

if (!user) {
throw new NotFoundException('User not found');
}

// ✅ ROLE VALIDATION
if (user.role !== UserRole.DOCTOR && user.role !== UserRole.NURSE) {
throw new BadRequestException(
'Only doctors or nurses can be added to a team',
);
}

// Prevent duplicates
const alreadyInTeam = team.users.some(u => u.id === userId);
if (alreadyInTeam) {
return {
message: 'User already belongs to this team',
data: team,
};
}

team.users.push(user);
const updatedTeam = await this.teamRepository.save(team);

return {
message: 'User added to team successfully',
data: updatedTeam,
};
}




public async removeUserFromTeam(
teamId: string,
userId: string,
): Promise<{ message: string; data: Team }> {
const team = await this.teamRepository.findOne({
where: { id: teamId },
relations: ['users'],
});

if (!team) {
throw new NotFoundException('Team not found');
}

// Check if user belongs to this team
const isMember = team.users.some(u => u.id === userId);
if (!isMember) {
throw new BadRequestException('User is not a member of this team');
}

// Remove user from team
team.users = team.users.filter(u => u.id !== userId);

const updatedTeam = await this.teamRepository.save(team);

return {
message: 'User removed from team successfully',
data: updatedTeam,
};
}




}
