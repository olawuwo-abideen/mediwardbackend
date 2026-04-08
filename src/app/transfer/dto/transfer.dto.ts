import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateTransferDto {
@ApiProperty({
description: 'doctorId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
patientId: string;


@ApiProperty({
description: 'wardId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
transferto: string;


@ApiProperty({
description: 'The reason for patient transfer',
example: 'The patient is feeling better',
})
@IsString()
reason: string;


}