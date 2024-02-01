import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('migrations')
@Unique(['name'])
export default class Migration {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar' })
  name: string;
}
