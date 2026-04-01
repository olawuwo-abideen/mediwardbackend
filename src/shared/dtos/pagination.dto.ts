// shared/dtos/pagination.dto.ts
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)   // converts query string "1" → number 1
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)   // converts query string "10" → number 10
  @IsNumber()
  pageSize?: number = 10;
}