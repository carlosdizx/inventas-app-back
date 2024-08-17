import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export default class CreateInventoryDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  name: string;

  @IsOptional()
  @MaxLength(255)
  city?: string;

  @IsOptional()
  @MaxLength(255)
  state?: string;

  @IsOptional()
  @MaxLength(20)
  zipCode?: string;

  @IsOptional()
  @MaxLength(255)
  country?: string;

  @IsOptional()
  @MaxLength(500)
  address?: string;
}
