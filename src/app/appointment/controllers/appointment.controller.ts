import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { BookAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { User } from '../../../shared/entities/user.entity';
import { UserRole } from '../../../shared/entities/user.entity';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { RolesGuard } from '../../../app/auth/guards/role.guard';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';

@ApiBearerAuth()
@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentController {
constructor(private readonly appointmentService: AppointmentService) {}

@Post('')    
@ApiOperation({ summary: 'Patient book an appointment' })
@ApiBody({ type: BookAppointmentDto, 
description: 'Create appointment data' })
@ApiResponse({
status: HttpStatus.CREATED,
description:
'Appointment booked successfully.',
})
@UseGuards(AuthGuard, RolesGuard) 
@Roles(UserRole.PATIENT)
async bookAppointment(
@CurrentUser() user: User,
@Body() data: BookAppointmentDto) {
return this.appointmentService.bookAppointment(user, data);
}

@Get('/available')
@ApiOperation({ summary: 'Get all available appointment' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment retrieved successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.PATIENT)
async getAppointments(@CurrentUser() user: User) {
return this.appointmentService.getAppointments(user);
}

@Get('')
@ApiOperation({ summary: 'Get appointments' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment retrieved successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR)
async getAppointmentsByDoctor(@CurrentUser() user: User) {
return this.appointmentService.getDoctorAppointments(user);
}

@Get(':id')
@ApiOperation({ summary: 'Get appointment details' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment retrieved successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR,UserRole.PATIENT)
async getAppointmentDetails(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string) {
return this.appointmentService.getAppointmentDetails(user, id);
}

@Put('details/:id')
@ApiOperation({ summary: 'Update appointment' })
@ApiBody({ type: UpdateAppointmentDto, 
description: 'Update appointment data' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment update successfully.',
})
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR, UserRole.PATIENT)
async updateAppointment(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,
@Body() updateAppointmentDto: UpdateAppointmentDto,
) {
return this.appointmentService.updateAppointment(user, id, updateAppointmentDto);
}

@Put('reschedule/:id')
@ApiOperation({ summary: 'Reschedule appointment' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment reschedule successfully.',
})
@UseGuards(AuthGuard, RolesGuard)
@Roles( UserRole.PATIENT)
async rescheduleAppointment(
@Param('id', IsValidUUIDPipe) appointmentId: string, @Body('newSlotId') newSlotId: string) {
return this.appointmentService.rescheduleAppointment(appointmentId, newSlotId);
}

@Delete(':id')
@ApiOperation({ summary: 'Delete appointment' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Appointment deleted successfully.',
})
@UseGuards(AuthGuard, RolesGuard)
@Roles( UserRole.PATIENT)
async cancelAppointment(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe ) id: string) {
return this.appointmentService.cancelAppointment(user, id);
}


}
