import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/entities/user.entity';
import { CreateTreatmentDto, UpdateTreatmentDto } from '../dto/treatment.dto';
import { TreatmentService } from '../services/treatment.service';

@ApiBearerAuth()
@ApiTags('Treatment')
@Controller('treatment')
export class TreatmentController {
constructor(private readonly treatmentService: TreatmentService){}



@Post(':patientId')
@ApiOperation({ summary: 'Treat a patient (doctor only)' })
@Roles(UserRole.DOCTOR)
async createTreatment(
  @Param('patientId') patientId: string,
  @Body() dto: CreateTreatmentDto, 
) {
  return this.treatmentService.createTreatment(patientId, dto);
}


@Get('patient-record/:patientId')
@ApiOperation({ summary: 'Get full patient record (doctor only)' })
@Roles(UserRole.DOCTOR)
async getPatientRecord(
  @Param('patientId') patientId: string,
) {
  return this.treatmentService.getPatientRecord(patientId);
}










}
