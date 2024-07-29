import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export default class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(-1)
  @Max(999)
  @Type(() => Number)
  @ApiProperty()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty()
  page?: number = 1;
}
