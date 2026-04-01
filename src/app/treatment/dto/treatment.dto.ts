import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTreatmentDto {
@ApiProperty({
description: 'The Patient symptoms',
example: 'The patient complain of headache',
})
@IsString()
@IsNotEmpty()
symptoms: string;

@ApiProperty({
description: 'The Patient diagnosis',
example: 'The patient has fever',
})
@IsString()
@IsNotEmpty()
diagnosis: string;

@ApiProperty({
description: 'The prescribe medication',
example: 'paracetamol',
})
@IsString()
@IsNotEmpty()
medication: string;


}


export class UpdateTreatmentDto {
@ApiProperty({
description: 'The Patient symptoms',
example: 'The patient complain of toothache',
})
@IsString()
@IsNotEmpty()
symptoms: string;

@ApiProperty({
description: 'The Patient diagnosis',
example: 'The patient has decay teeth',
})
@IsString()
@IsNotEmpty()
diagnosis: string;

@ApiProperty({
description: 'The prescribe medication',
example: 'abtibiotics',
})
@IsString()
@IsNotEmpty()
medication: string;


}