import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';


export class AdmitPatientDto {


@ApiProperty({
description: 'The  wardId',
example: '111111111111111111',
})
@IsUUID()
@IsNotEmpty()
wardId: string;

@ApiProperty({
description: 'The  reason for admission',
example: 'The Patient complain of headache',
})
@IsString()
@IsNotEmpty()
reasonforadmission: string;





}



