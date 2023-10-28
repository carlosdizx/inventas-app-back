import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../enums/user.roles.enum';

export default class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column('enum', {
    enum: UserRoles,
    array: true,
    default: [Object.values(UserRoles)],
  })
  roles: UserRoles[];
}
