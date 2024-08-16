import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export default class CreateInventoryDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional()
  city?: string;

  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional()
  state?: string;

  @IsOptional()
  @MaxLength(20)
  @ApiPropertyOptional()
  zipCode?: string;

  @IsOptional()
  @MaxLength(255)
  @ApiPropertyOptional()
  country?: string;

  @IsOptional()
  @MaxLength(500)
  @ApiPropertyOptional()
  address?: string;
}
