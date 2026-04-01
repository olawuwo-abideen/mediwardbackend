import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '../../../shared/entities/user.entity';

export class PatientSignupDto {
  @ApiProperty({ example: 'Olawuwo' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Abideen' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'abideenolawuwo@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1998-05-12' })
  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '09012345678' })
  @IsNotEmpty()
  @IsString()
  phonenumber: string;

  @ApiProperty({ example: 'Password123--' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}






export class StaffSignupDto {
  @ApiProperty({ example: 'Olawuwo' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Abideen' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'abideenolawuwo@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1998-05-12' })
  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    enum: [UserRole.DOCTOR, UserRole.NURSE],
    example: UserRole.DOCTOR,
  })
  @IsNotEmpty()
  @IsIn([UserRole.DOCTOR, UserRole.NURSE], {
    message: 'Staff role must be Doctor or Nurse',
  })
  role: UserRole;

  @ApiProperty({ example: '09012345678' })
  @IsNotEmpty()
  @IsString()
  phonenumber: string;

  @ApiProperty({ example: 'Password123--' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}