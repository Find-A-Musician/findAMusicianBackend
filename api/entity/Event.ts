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

  @Column('time without time zone')
  startDate: Date;

  @Column('time without time zone')
  endDate: Date;

  @Column('varchar')
  adress: string;

  @ManyToMany(() => Genre, (genre) => genre.events, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Band, (band) => band.events, { onDelete: 'CASCADE' })
  @JoinTable()
  bands: Band[];

  @ManyToMany(() => Musician, (musician) => musician.adminEvents, {
    onDelete: 'CASCADE',
  })
  admins: Musician[];
}
