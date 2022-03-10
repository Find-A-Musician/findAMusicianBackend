import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Groups } from './Groups';
import { Genre } from './Genre';
import { Musician } from './Musician';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column('timestamp without time zone')
  startDate: Date;

  @Column('timestamp without time zone')
  endDate: Date;

  @Column('varchar')
  adress: string;

  @ManyToMany(() => Genre, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Groups, (group) => group.events, { onDelete: 'CASCADE' })
  @JoinTable()
  groups: Groups[];

  @ManyToMany(() => Musician, (musician) => musician.adminEvents, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  admins: Musician[];
}
