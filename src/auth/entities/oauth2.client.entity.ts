import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../enums/role.enum';

@Entity('oauth2_clients')
export default class Oauth2Client {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  businessName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecret: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: false })
  revoked: boolean;

  @Column({ nullable: true })
  validUntil: Date;

  @Column('enum', {
    enum: Roles,
    array: true,
    default: [Object.values(Roles)],
  })
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
