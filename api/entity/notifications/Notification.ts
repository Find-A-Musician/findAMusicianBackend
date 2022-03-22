import {
  Entity,
  TableInheritance,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Musician } from '../index';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Musician, (musician) => musician.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  musician: Musician;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
