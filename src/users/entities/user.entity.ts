import {
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserRoles } from '../enums/user.roles.enum';
import UserDetails from './user.details.entity';
import Enterprise from '../../enterprise/entities/enterprise.entity';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import UserOtp from './user-otp.entity';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: StatusEntity,
    default: StatusEntity.PENDING_CONFIRMATION,
  })
  status: StatusEntity;

  @Column('enum', {
    enum: UserRoles,
    array: true,
  })
  roles: UserRoles[];

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
  @JoinColumn({ name: 'user_detail_id' })
  userDetails: UserDetails;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.users, {
    nullable: true,
  })
  @JoinColumn({ name: 'enterprise_id' })
  enterprise: Enterprise;

  @OneToMany(() => UserOtp, (userOtp) => userOtp.user)
  otps: UserOtp[];
}
