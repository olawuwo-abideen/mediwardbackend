// import { ApiProperty } from '@nestjs/swagger';
// import { IsMobilePhone, IsNotEmpty, IsString, IsNumber } from 'class-validator';
// import { Gender } from '../../../shared/entities/user.entity';


// export class UpdateProfileDto {
//   @ApiProperty({
//     description: 'First name of the user.',
//     example: 'John',
//   })
//   @IsNotEmpty()
//   @IsString()
//   firstname: string;

//   @ApiProperty({
//     description: 'Last name of the user.',
//     example: 'Doe',
//   })
//   @IsNotEmpty()
//   @IsString()
//   lastname: string;

//   @ApiProperty({
//     description: 'Age of the user.',
//     example: 25,
//   })
//   @IsNumber()
//   @IsNotEmpty()
//   dob: Date;

//   @ApiProperty({
//     description: 'Phone number of the user.',
//     example: '08012345678',
//   })
//    @IsMobilePhone()
//   @IsNotEmpty()
//   phonenumber: string;

//   @ApiProperty({
//     description: 'The user gender. allowed values: female and male',
//     enum: Gender,
//     example: 'male',
//   })
//  @IsNotEmpty()
//  gender: Gender;

// }


import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsEnum, Matches } from 'class-validator';
import { Gender } from '../../../shared/entities/user.entity';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'Date of birth of the user.',
    example: '2000-05-15',
  })
  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @ApiProperty({
    description: 'Phone number of the user.',
    example: '08012345678',
  })
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be 10 to 15 digits',
  })
  @IsNotEmpty()
  phonenumber: string;

  @ApiProperty({
    description: 'The user gender. allowed values: female and male',
    enum: Gender,
    example: 'male',
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}




