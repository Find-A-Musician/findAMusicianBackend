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

  // @Column('timestamp without time zone')
  // startDate: string;

  // @Column('time without time zone')
  // endDate: string;

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
  @JoinTable()
  admins: Musician[];
}
