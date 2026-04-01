import { ApiProperty } from '@nestjs/swagger';
import {
IsEmail,
IsNotEmpty,  
IsOptional,  
IsString, 
Matches,
MaxLength,
MinLength,
} from 'class-validator';

export class AdminLoginDto {
@ApiProperty({
required: true,
description: 'Email address of the user',
example: 'mediwardadmin@gmail.com',
})
@IsNotEmpty()
@IsEmail()
email: string;

@ApiProperty({
required: true,
description: 'The user password (at least 8 characters)',
example: 'Mediward@2026@@',
})
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
