import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export default class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(-1)
  @Max(999)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsUUID()
  inventoryId?: string;
}
