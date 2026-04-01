import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

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


}