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
import { Location } from './Musician';

@Entity()
export class Band {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['Douai', 'Lille'],
  })
  location: Location;

  @ManyToMany(() => Genre, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => MusicianBand, (musicianBand) => musicianBand.group, {
    onDelete: 'CASCADE',
  })
  members: MusicianBand[];

  @ManyToMany(() => Event, (event) => event.groups, { onDelete: 'CASCADE' })
  events: Event[];
}
