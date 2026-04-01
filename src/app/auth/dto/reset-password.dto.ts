import { ApiProperty } from '@nestjs/swagger';
import {
IsNotEmpty,
IsString,
Matches,
MaxLength,
MinLength,
} from 'class-validator';
import { PasswordMatch } from '../../../shared/validations/password-validation.dto';

export class ForgotPasswordDto {
@ApiProperty({
required: true,
description: 'Email address of the user',
example: 'abideenolawuwo2000@gmail.com',
})
@IsString()
@IsNotEmpty()
email: string;
}

export class ResetPasswordDto {
@ApiProperty({
required: true,
description: 'The user new password (at least 8 characters)',
example: 'Password123',
})
@IsNotEmpty()
@IsString()
@MinLength(6, { message: 'Password must be at least 6 characters long' })
@MaxLength(20, { message: 'Password must not exceed 20 characters' })
@Matches(
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
{
message:
'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
},
)
password: string;

@ApiProperty({
required: true,
description: 'The user confirm new password (at least 8 characters)',
example: 'Password123',
})
@IsNotEmpty({ message: 'Confirm password is required' })
@IsString()
@PasswordMatch()
confirmPassword: string;

@ApiProperty({
required: true,
description: 'The user reset password token',
example: 'tywokqixdxapmquhqrdeqokwugwrdw9wq--=-458hdsgvsfcq5e581f2rd2528y_',
})
@IsString()
@IsNotEmpty()
token: string;
}
