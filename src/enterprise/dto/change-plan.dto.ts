import { IsUUID } from 'class-validator';

export default class ChangePlanDto {
  @IsUUID()
  id: string;
}
