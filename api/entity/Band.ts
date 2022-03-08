import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location, Genre } from '.';
import { MusicianBand } from './MusicianGroup';

@Entity()
export class Band {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  // @Column('enum', { nullable: false, enum: Location, enumName: 'location' })
  // location!: Location;

  @ManyToMany(() => Genre, (genre) => genre.groups, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => MusicianBand, (musicianBand) => musicianBand.group)
  musicianBands: MusicianBand[];
}
