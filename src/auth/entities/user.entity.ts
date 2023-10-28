import {
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Entity,
} from 'typeorm';
import { UserRoles } from '../enums/user.roles.enum';
import UserDetails from './user.details.entity';

@Entity('users')
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
  })
  roles: UserRoles[];

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  @JoinColumn()
  userDetails: UserDetails;
}
