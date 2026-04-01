import { Controller, Delete, Get, HttpStatus, Param,UseGuards, Query, Post, Body } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { AdmitPatientDto } from '../dto/patient.dto';

@ApiBearerAuth()
@ApiTags('Patient')
@Controller('patient')
export class PatientController {

constructor(private readonly patientService: PatientService){}


@Get('')
@ApiOperation({ summary: 'Get all patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
async getAllPatients(@Query() paginationData: PaginationDto) {
return await this.patientService.getAllPatients(paginationData);
}

@Get('search')
@ApiOperation({ summary: 'Search patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
async searchPatientsByName(
@Query('search') search: string,
@Query() pagination: PaginationDto,
) {
return this.patientService.searchPatientsByName(search, pagination);
}


@Get(':id')
@ApiOperation({ summary: 'Get a patients' })
@ApiResponse({
status: HttpStatus.OK,
description: 'Successfully retrieved patients.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.NURSE)
@ApiOperation({ summary: 'Get a bed' })
public async getPatient(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.patientService.getPatient(id)
}




@Post('admit/:patientId')
@ApiOperation({ summary: 'Admit a patient (doctor or nurse only)' })
@Roles(UserRole.DOCTOR, UserRole.NURSE)
async admitPatient(
  @Param('patientId') patientId: string,
  
  @Body() admitPatientDto: AdmitPatientDto, 
) {
  return this.patientService.admitPatient(patientId, admitPatientDto);
}

  @Post('discharge/:patientId')
  @ApiOperation({ summary: 'Discharge a patient (doctor only)' })
  @Roles(UserRole.DOCTOR)
  async dischargePatient(@Param('patientId') patientId: string) {
    return this.patientService.dischargePatient(patientId);
  }

  @Get('history/:patientId')
  @ApiOperation({ summary: 'Get admission history of a patient' })
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  async getHistory(@Param('patientId') patientId: string) {
    return this.patientService.getAdmissionHistory(patientId);
  }

  @Get('status/:patientId')
  @ApiOperation({ summary: 'Get current admission status of a patient' })
  @Roles(UserRole.DOCTOR, UserRole.NURSE)
  async getStatus(@Param('patientId') patientId: string) {
    return this.patientService.getCurrentStatus(patientId);
  }


}