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
import { MusicianBand } from './MusicianGroup';

export enum Promotion {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  M1 = 'M1',
  M2 = 'M2',
}

export enum Location {
  Douai = 'Douai',
  Lille = 'Lille',
}

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
  phone: number;

  @Column('text', { nullable: true })
  facebookUrl: string;

  @Column('text', { nullable: true })
  twitterUrl: string;

  @Column('text', { nullable: true })
  instagramUrl: string;

  @Column({
    type: 'enum',
    enum: Promotion,
  })
  promotion: Promotion;

  @Column({
    type: 'enum',
    enum: Location,
  })
  location: Location;

  @Column('text')
  password: string;

  @ManyToMany(() => Instrument, (instrument) => instrument.musicians, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  instruments: Instrument[];

  @ManyToMany(() => Genre, (genre) => genre.musicians, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => MusicianBand, (musicianBand) => musicianBand.musician, {
    onDelete: 'CASCADE',
  })
  musicianGroups: MusicianBand[];
}
