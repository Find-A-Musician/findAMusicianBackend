import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from '.';
import { MusicianBand } from './MusicianGroup';
import { Event } from './Event';

@Entity()
export class Band {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  // Error of map when setting two same enum in two differents entitys...
  // @Column('enum', { nullable: false, enum: Location, enumName: 'location' })
  // location!: Location;

  @ManyToMany(() => Genre, (genre) => genre.groups, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => MusicianBand, (musicianBand) => musicianBand.group, {
    onDelete: 'CASCADE',
  })
  musicianBands: MusicianBand[];

  @ManyToMany(() => Event, (event) => event.bands, { onDelete: 'CASCADE' })
  events: Event[];
}
