import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ward } from '../../../shared/entities/ward.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { Admission } from '../../../shared/entities/admission.entity';

@Injectable()
export class WardService {

constructor(
@InjectRepository(Ward)
private wardRepository: Repository<Ward>,
@InjectRepository(Admission)
private admissionRepository: Repository<Admission>
) {}



public async getWards(pagination: PaginationDto): Promise<{ message: string; data: Ward[] }> {
const { page = 1, pageSize = 10 } = pagination;
const [data] = await this.wardRepository.findAndCount({
skip: (page - 1) * pageSize,
take: pageSize,
});
return { message: 'Wards retrieved successfully', data };
}

public async searchWards(searchQuery: string | null, pagination: PaginationDto): Promise<{ message: string; data: Ward[] }> {
let wards: Ward[];
if (!searchQuery) {
wards = await this.getWards(pagination).then(res => res.data);
} else {
wards = await this.wardRepository.find({
where: {
name: ILike(`%${searchQuery}%`),
},
skip: (pagination.page - 1) * pagination.pageSize,
take: pagination.pageSize,
});
}
return { message: 'Wards retrieved successfully', data: wards };
}


public async getTotalNumberOfWards(): Promise<{ message: string; total: number }> {
const total = await this.wardRepository.count();
return { message: 'Total number of wards retrieved successfully', total };
}




public async getWard(id: string): Promise<{ message: string; ward: any }> {
  const ward = await this.wardRepository.findOne({
    where: { id },
    select: {
      id: true,
      name: true,
      bedoccupancy: true,
      bedcapacity: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!ward) {
    throw new NotFoundException('Ward not found');
  }

  const activeAdmissions = await this.admissionRepository.find({
    where: {
      isAdmitted: true,
      patient: {
        ward: { id },
      },
    },
    relations: ['patient', 'patient.ward'],
  });

  const patients = activeAdmissions.map(a => a.patient);

  return {
    message: 'Ward retrieved successfully',
    ward: {
      ...ward,
      patients,
    },
  };
}




}
