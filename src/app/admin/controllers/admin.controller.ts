import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { Public } from '../../../shared/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';
import { CreateWardDto, UpdateWardDto } from '../../../app/ward/dto/ward.dto';
import { AdminAuthGuard } from '../guards/adminguard';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';


@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
constructor(private readonly adminService: AdminService) {}

@Public()
@Post('login')
@ApiOperation({ summary: 'Admin login' })
async login(@Body() user: AdminLoginDto) {
return this.adminService.login(user);
}

@ApiBearerAuth()
@Get('staff')
@ApiOperation({ summary: 'Get all staff users' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAllStaffs(@Query() pagination: PaginationDto) {
return await this.adminService.getAllStaffs(pagination);
}

@ApiBearerAuth()
@Get('staff/doctor')
@ApiOperation({ summary: 'Get total number of doctor' })
async countAllDoctors() {
return this.adminService.countAllDoctors();
}

@ApiBearerAuth()
@Get('staff/patient')
@ApiOperation({ summary: 'Get total number of nurses' })
async countAllNurses() {
return this.adminService.countAllNurses();
}


@ApiBearerAuth()
@Get('patient/admitted')
@ApiOperation({ summary: 'Get total admitted patient' })
async getTotalAdmittedPatients() {
return this.adminService.getTotalAdmittedPatients();
}

@ApiBearerAuth()
@Get('staff/nurse')
@ApiOperation({ summary: 'Get total number of patient' })
async countPatients() {
return this.adminService.countPatients();
}
@ApiBearerAuth()
@Get('users')
@ApiOperation({ summary: 'Get all users' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getAllUsers(@Query() pagination: PaginationDto) {
return await this.adminService.getAllUsers(pagination);
}

@ApiBearerAuth()
@Delete('user/:id')
@ApiOperation({ summary: 'Delete a user' })
public async deleteUser(
@Param('id', IsValidUUIDPipe) id: string,
)  {    
return await this.adminService.deleteUser({ id });
}

@ApiBearerAuth()
@Get('user/:id')
@ApiOperation({ summary: 'Get a user' })
public async getUser(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.getUser(id)
}



//reports

@ApiBearerAuth()
@Get('admissions')
@ApiOperation({ summary: 'Get all admissions' })
getAdmissions() {
  return this.adminService.getAdmissions();
}

@ApiBearerAuth()
@Get('discharges')
@ApiOperation({ summary: 'Get Patient discharge summary' })
getDischarges() {
return this.adminService.getDischargeSummary();
}

@ApiBearerAuth()
@Get('appointments')
@ApiOperation({ summary: 'Get appointment per doctor' })
getAppointmentsStats() {
return this.adminService.getAppointmentsPerDoctor();
}




//ward
@ApiBearerAuth()
@Post('ward')
@ApiOperation({ summary: 'Create ward' })
public async createWard(
@Body() data: CreateWardDto,
) {
return await this.adminService.createWard(data)
}

@ApiBearerAuth()
@Get('ward')
@ApiOperation({ summary: 'Get wards' })
public async getWards() {
  return await this.adminService.getWards();
}

@ApiBearerAuth()
@Put('ward/:id')
@ApiOperation({ summary: 'Update ward' })
public async updateWard(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateWardDto,
) {
return  await this.adminService.updateWard(
id,
data,
)
}

@ApiBearerAuth()
@Delete('ward/:id')
@ApiOperation({ summary: 'Delete ward' })
public async deleteWard(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.deleteWard(id)
}


@ApiBearerAuth()
@Get('ward/total')
@ApiOperation({ summary: 'Get total number of ward' })
public async getTotalNumberOfWards() {
  return await this.adminService.getTotalNumberOfWards();
}


@ApiBearerAuth()
@Get('ward/:id')
@ApiOperation({ summary: 'Get a ward' })
public async getWard(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.getWard(id)

}



//Team

@ApiBearerAuth()
@Post('team')
@ApiOperation({ summary: 'Create team' })
public async createTeam(
@Body() data: CreateTeamDto,
) {
return await this.adminService.createTeam(data)
}



@ApiBearerAuth()
@Get('team/:id')
@ApiOperation({ summary: 'Get a team' })
public async getTeam(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.getTeam(id)

}


@ApiBearerAuth()
@Get('team')
@ApiOperation({ summary: 'Get teams' })
public async getTeams() {
  return await this.adminService.getTeams();
}

@ApiBearerAuth()
@Put('team/:id')
@ApiOperation({ summary: 'Update team' })
public async updateTeam(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateTeamDto,
) {
return  await this.adminService.updateTeam(
id,
data,
)
}

@ApiBearerAuth()
@Delete('team/:id')
@ApiOperation({ summary: 'Delete team' })
public async deleteTeam(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.adminService.deleteTeam(id)
}


@ApiBearerAuth()
@Post('team/:teamId/add-user/:userId')
@ApiOperation({ summary: 'Add user to a team' })
public async addUserToTeam(
  @Param('teamId') teamId: string,
  @Param('userId') userId: string,
) {
  return await this.adminService.addUserToTeam(teamId, userId);
}



@ApiBearerAuth()
@Delete('team/:teamId/remove-user/:userId')
@ApiOperation({ summary: 'Remove user from a team' })
public async removeUserFromTeam(
  @Param('teamId') teamId: string,
  @Param('userId') userId: string,
) {
  return await this.adminService.removeUserFromTeam(teamId, userId);
}


}
