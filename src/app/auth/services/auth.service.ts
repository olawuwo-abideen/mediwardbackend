import {
BadRequestException,
Injectable,
UnauthorizedException,
NotFoundException,
ConflictException
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { EntityManager, Repository } from 'typeorm';
import { PatientSignupDto, StaffSignupDto } from '../dto/signup.dto';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../../../shared/modules/email/email.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from "bcryptjs"
import { VerificationService } from '../../../shared/services/verification/verification.service';
import { ResendOtpDto, verifyOtpDto } from '../dto/verifyotp.dto';


@Injectable()
export class AuthService {
constructor(
private readonly userService: UserService,
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
@InjectEntityManager() private readonly entityManager: EntityManager,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
private readonly emailService: EmailService,
private readonly verificationService: VerificationService
) {}



private async createUser(data: Partial<User>) {
  return await this.entityManager.transaction(async (manager) => {
    const existingEmailUser = await manager.findOne(User, {
      where: { email: data.email },
    });
    if (existingEmailUser) {
      throw new ConflictException('Email already in use');
    }

    const existingPhoneUser = await manager.findOne(User, {
      where: { phonenumber: data.phonenumber },
    });
    if (existingPhoneUser) {
      throw new ConflictException('Phone number is already in use');
    }

    const hashedPassword = await bcryptjs.hash(data.password!, 10);

    const user = manager.create(User, {
      ...data,
      password: hashedPassword,
      accountStatus: 'inactive',
    });

    return await manager.save(user);
  });
}


async signupPatient(data: PatientSignupDto) {
  const savedUser = await this.createUser({
    ...data,
    role: UserRole.PATIENT,
  });

  const otp = await this.verificationService.generateOtp(savedUser.id);
  await this.emailService.sendVerificationEmail(savedUser, otp);

  delete savedUser.password;

  return {
    message: 'Patient signup successful. OTP sent',
    user: savedUser,
  };
}


async signupStaff(data: StaffSignupDto) {
  if (![UserRole.DOCTOR, UserRole.NURSE].includes(data.role)) {
    throw new BadRequestException('Invalid staff role');
  }

  const savedUser = await this.createUser(data);

  const otp = await this.verificationService.generateOtp(savedUser.id);
  await this.emailService.sendVerificationEmail(savedUser, otp);

  delete savedUser.password;

  return {
    message: 'Staff signup successful. OTP sent',
    user: savedUser,
  };
}

// async signup(data: SignupDto) {
// const savedUser = await this.entityManager.transaction(async (manager) => {
// const existingEmailUser = await manager.findOne(User, {
// where: { email: data.email },
// });
// if (existingEmailUser) {
// throw new ConflictException('Email already in use');
// }
// const existingPhoneUser = await this.userRepository.findOne({
// where: { phonenumber: data.phonenumber },
// });
// if (existingPhoneUser) {
// throw new ConflictException('Phone number is already in use');
// }
// const hashedPassword = await bcryptjs.hash(data.password, 10);
// const user = manager.create(User, {
// ...data,
// password: hashedPassword,
// accountStatus: 'inactive',
// });
// return await manager.save(user);
// });

// const otp = await this.verificationService.generateOtp(savedUser.id);
// await this.emailService.sendVerificationEmail(savedUser, otp);
// delete savedUser.password;
// return {
// message: 'Signup successful. OTP sent',
// user: savedUser,
// };
// }


async verifyEmail(data: verifyOtpDto) {
const { email, otp } = data;
const user = await this.userService.findOne({ email }); 
if (!user) {
throw new NotFoundException('User not found');
}
const isValid = await this.verificationService.validateOtp(
user.id,
otp, 
);
if (!isValid) {
throw new BadRequestException('Invalid or expired OTP');
}
user.emailVerifiedAt = new Date();
user.accountStatus = 'active';
await this.userRepository.save(user);
return { message: 'Email verified successfully, Login' };
}




async resendOtp(data: ResendOtpDto) {

  const { email } = data;
  const user = await this.userService.findOne({ email });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Prevent resending if already verified
  if (user.accountStatus === 'active') {
    throw new BadRequestException('User already verified');
  }

//   // OPTIONAL: delete old OTP (recommended)
//   await this.verificationService.deleteOtp(user.id);

  // Generate new OTP
  const otp = await this.verificationService.generateOtp(user.id);

  // Send email
  await this.emailService.sendVerificationEmail(user, otp);

  return {
    message: 'A new OTP has been sent to your email',
  };
}



async login({ email, password }: LoginDto) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await this.userService.findOne({ email: normalizedEmail });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  if (!user.emailVerifiedAt || user.accountStatus !== 'active') {
    throw new UnauthorizedException('Please verify your email first');
  }

  return {
    message: 'Login successful',
    accessToken: this.createAccessToken(user),
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
  };
}



public createAccessToken(user: User): string {
return this.jwtService.sign({ sub: user.id });
}

async forgotPassword(email: string): Promise<{message:string}> {
const user: User | null = await this.userService.findOne({ email });

if (!user) {
throw new NotFoundException(`Email does not exist in our record.`);
}

const payload = { email: user.email };
const token = this.jwtService.sign(payload, {
secret: this.configService.get<string>('JWT_SECRET'),
expiresIn: `${this.configService.get<string>('JWT_EXPIRES_IN')}`,
});

user.resetToken = token;

await this.userRepository.update(
{
id: user.id,
},
{
resetToken: token,
},
);
await this.emailService.sendResetPasswordLink(user);
return { message: 'Reset token sent to user email' };
}


public async decodeConfirmationToken(token: string) {
try {
const payload = await this.jwtService.verify(token, {
secret: this.configService.get('JWT_SECRET'),
});

return payload?.email;
} catch (error) {
if (error?.name === 'TokenExpiredError') {
throw new BadRequestException('Reset password link expired.');
}
throw new BadRequestException('Reset password link expired.');
}
}

async resetPassword(payload: ResetPasswordDto): Promise<{message:string}> {
const email = await this.decodeConfirmationToken(payload.token);

const user: User | null = await this.userService.findOne({
email,
resetToken: payload.token,
});

if (!user) {
throw new BadRequestException(`Reset token expired. please try again.`);
}
const saltRounds = 10;
const password = await bcryptjs.hash(payload.password, saltRounds);

await this.userRepository.update(
{ id: user.id },
{ password, resetToken: null },
);
return { message: 'Password reset successfully' };
}


}
