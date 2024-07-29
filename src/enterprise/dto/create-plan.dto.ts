import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreatePlanEnterpriseDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsInt()
  @IsPositive()
  @Max(50)
  @ApiProperty()
  maxUsers: number;
}
