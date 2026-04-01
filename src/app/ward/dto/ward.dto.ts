import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class CreateWardDto {

@ApiProperty({
description: 'The ward name',
example: 'Ward 1',
})
@IsString()
@IsNotEmpty()
name: string;


}



export class UpdateWardDto {

@ApiProperty({
description: 'The ward name',
example: 'Ward 2',
})
@IsString()
@IsNotEmpty()
name: string;



}