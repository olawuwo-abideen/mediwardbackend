import {
Controller,
Get,
Request,
Body,
Post,
Put,
HttpStatus,
UseGuards
} from '@nestjs/common';
import RequestWithUser from '../../../shared/dtos/request-with-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../../../shared/entities/user.entity';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';


@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
constructor(private readonly userService: UserService) {}

@Get('')
@ApiOperation({ summary: 'Get current user profile' })
@ApiResponse({ 
status: HttpStatus.OK,
description:
'User profile retrieve successfully.',
})
async getProfile(@Request() req: RequestWithUser) {
return await this.userService.profile(req.user);
}

@Post('change-password')
@ApiOperation({ summary: 'User change password' })
@ApiBody({ type: ChangePasswordDto, description: 'Change user password' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User Password updated successfully',
})
public async changePassword(
@Body() payload: ChangePasswordDto,
@CurrentUser({selectPassword:true}) user: User,
) {
return await this.userService.changePassword(payload, user);
}

@Put('')
@ApiOperation({ summary: 'Update user profile' })
@ApiBody({ type: UpdateProfileDto, description: 'Update user profile data' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User profile updated successfully',
})
@UseGuards(AuthGuard) 
public async updateProfile(
@Body() payload: UpdateProfileDto,
@CurrentUser() user: User,
) {
return await this.userService.updateProfile(payload, user);
}


@Get('/treatment')
@ApiOperation({ summary: 'Get current user treatments' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User treatments retrieved successfully.',
})
async getMyTreatments(@Request() req: RequestWithUser) {
  return this.userService.getCurrentUserTreatments(req.user);
}


@Get('/transfer')
@ApiOperation({ summary: 'Get current user transfers' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User transfers retrieved successfully.',
})
async getMyTransfers(@Request() req: RequestWithUser) {
  return this.userService.getCurrentUserTransfers(req.user);
}


@Get('/admission')
@ApiOperation({ summary: 'Get current user admission' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User admissions retrieved successfully.',
})
async getMyAdmissions(@Request() req: RequestWithUser) {
  return this.userService.getCurrentUserAdmissions(req.user);
}

@ApiBearerAuth()
@Get('/discharge')
@ApiOperation({ summary: 'Get current user discharge history' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User discharges history retrieved successfully.',
})
async getMyDischarges(@Request() req: RequestWithUser) {
  return this.userService.getCurrentUserDischarges(req.user);
}


@Get('/ward')
@ApiOperation({ summary: 'Get current user ward' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User ward retrieved successfully.',
})
async getMyWard(@Request() req: RequestWithUser) {
  return this.userService.getCurrentUserWard(req.user);
}




@Get('/team')
@ApiOperation({ summary: 'Get current user team' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'User team retrieved successfully.',
})
async getMyTeam(@Request() req: RequestWithUser) {
  return this.userService.getCurrentUserTeam(req.user);
}








}
