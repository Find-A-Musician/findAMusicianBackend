import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './Genre';
import { Instrument } from './Instrument';
import { Event } from './Event';
import { MusicianGroup } from './MusicianGroup';

export type Promotion = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
export type Location = 'Douai' | 'Lille';

@Entity()
export class Musician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 255 })
  email: string;

  @Column('varchar')
  givenName: string;

  @Column('varchar')
  familyName: string;

  @Column('varchar', { nullable: true, length: 50 })
  phone: string;

  @Column('text', { nullable: true })
  facebookUrl: string;

  @Column('text', { nullable: true })
  twitterUrl: string;

  @Column('text', { nullable: true })
  instagramUrl: string;

  @Column({
    type: 'enum',
    enum: ['L1', 'L2', 'L3', 'M1', 'M2'],
  })
  promotion: Promotion;

  @Column({
    type: 'enum',
    enum: ['Douai', 'Lille'],
  })
  location: Location;

  @Column('text')
  password: string;

  @ManyToMany(() => Instrument, { onDelete: 'CASCADE' })
  @JoinTable()
  instruments: Instrument[];

  @ManyToMany(() => Genre, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => MusicianGroup, (musicianGroup) => musicianGroup.musician, {
    onDelete: 'CASCADE',
  })
  musicianGroups: MusicianGroup[];

  @ManyToMany(() => Event, (event) => event.admins, { onDelete: 'CASCADE' })
  adminEvents: Event[];
}
