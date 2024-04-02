import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreatePlanEnterpriseDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  @Max(50)
  maxUsers: number;
}
