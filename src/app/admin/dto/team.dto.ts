import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class CreateTeamDto {

@ApiProperty({
description: 'The team name',
example: 'Team 1',
})
@IsString()
@IsNotEmpty()
name: string;


}



export class UpdateTeamDto {

@ApiProperty({
description: 'The team name',
example: 'Team 2',
})
@IsString()
@IsNotEmpty()
name: string;



}