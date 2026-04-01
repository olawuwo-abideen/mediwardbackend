import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PatientSignupDto, StaffSignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from '../../../shared/decorators/public.decorator';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/reset-password.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResendOtpDto, verifyOtpDto } from '../dto/verifyotp.dto';


@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
constructor(
private readonly authService: AuthService,
) {}

 @Post('patient/signup')
  @ApiOperation({ summary: 'Patient signup' })
  @ApiBody({ type: PatientSignupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Patient successfully signed up.',
  })
  async patientSignup(@Body() data: PatientSignupDto) {
    return await this.authService.signupPatient(data);
  }

  @Post('staff/signup')
  @ApiOperation({ summary: 'Staff signup' })
  @ApiBody({ type: StaffSignupDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Staff successfully signed up.',
  })
  async staffSignup(@Body() data: StaffSignupDto) {
    return await this.authService.signupStaff(data);
  }



@Post('verify-email')
@ApiOperation({ summary: 'Verify user email' })
async verifyEmail(@Body() data: verifyOtpDto) {
return this.authService.verifyEmail(data);
}

@Post('resend-otp')
@ApiOperation({ summary: 'Resend verification OTP' })
@ApiBody({ type: ResendOtpDto })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'OTP resent successfully',
})
async resendOtp(@Body() data: ResendOtpDto) {
  return await this.authService.resendOtp(data);
}

@Post('login')
@ApiOperation({ summary: 'User login' })
@ApiBody({ type: LoginDto, description: 'User Log-In Data' })
@ApiResponse({
status: HttpStatus.OK,
description: 'User successfully signed in. access token generated.',
})
@ApiResponse({
status: HttpStatus.UNAUTHORIZED,
description: 'Invalid credentials.',
})
async login(@Body() user: LoginDto) {
return this.authService.login(user);
}

@Post('forgot-password')
@ApiOperation({ summary: 'User forgot password' })
@ApiBody({ type: ForgotPasswordDto, description: 'User email' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Password Reset token sent to email',
})
async forgotPassword(@Body() { email }: ForgotPasswordDto) {
return this.authService.forgotPassword(email);
}

@Post('reset-password')
@ApiOperation({ summary: 'User reset password' })
@ApiBody({ type: ResetPasswordDto, description: 'User reset password' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User password reset successfully',
})
async resetPassword(@Body() payload: ResetPasswordDto){
await this.authService.resetPassword(payload);
}




}
