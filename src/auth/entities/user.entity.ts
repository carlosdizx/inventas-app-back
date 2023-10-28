import { Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { UserRoles } from '../enums/user.roles.enum';
import UserDetails from './user.details.entity';

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

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  @JoinColumn()
  userDetails: UserDetails;
}
