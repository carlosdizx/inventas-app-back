import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('migrations')
@Unique(['name'])
export default class Migration {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
