import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Band } from './Band';
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

  @ManyToMany(() => Genre, (genre) => genre.events, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Band, (band) => band.events, { onDelete: 'CASCADE' })
  @JoinTable()
  groups: Band[];

  @ManyToMany(() => Musician, (musician) => musician.adminEvents, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  admins: Musician[];
}
