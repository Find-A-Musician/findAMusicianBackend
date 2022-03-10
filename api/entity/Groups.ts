import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from '.';
import { MusicianGroup } from './MusicianGroup';
import { Event } from './Event';
import { Location } from './Musician';

@Entity()
export class Groups extends BaseEntity {
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

  @OneToMany(() => MusicianGroup, (musicianGroup) => musicianGroup.group, {
    onDelete: 'CASCADE',
  })
  members: MusicianGroup[];

  @ManyToMany(() => Event, (event) => event.groups, { onDelete: 'CASCADE' })
  events: Event[];
}
