import { ApiProperty } from '@nestjs/swagger';
import {
IsEmail,
IsNotEmpty,   
IsString, 
} from 'class-validator';

export class verifyOtpDto {
@ApiProperty({
required: true,
description: 'Email address of the user',
example: 'patient1@gmail.com',
})
@IsNotEmpty()
@IsEmail()
email: string;

@ApiProperty({
required: true,
description: 'One time password send to email',
example: '123456',
})
@IsNotEmpty()
@IsString()
otp: string;

}


export class ResendOtpDto {
@ApiProperty({
required: true,
description: 'Email address of the user',
example: 'patient1@gmail.com',
})
@IsNotEmpty()
@IsEmail()
email: string;

}