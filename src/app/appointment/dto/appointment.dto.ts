import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';



export class BookAppointmentDto {

@ApiProperty({
description: 'availabilitySlotId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
availabilitySlotId: string;
}


export class UpdateAppointmentDto {

@ApiProperty({
description: 'availabilitySlotId',
example: '3f7f541f-e17d-4254-8370-c803b671beb7',
})
@IsUUID()
availabilitySlotId?: string;
}

