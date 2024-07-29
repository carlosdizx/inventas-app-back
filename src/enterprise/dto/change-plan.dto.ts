import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ChangePlanDto {
  @IsUUID()
  @ApiProperty()
  id: string;
}
