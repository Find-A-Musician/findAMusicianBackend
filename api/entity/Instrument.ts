import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Musician } from './Musician';
import { MusicianBand } from './MusicianGroup';

@Entity()
export class Instrument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToMany(() => Musician, (musician) => musician.instruments, {
    onDelete: 'CASCADE',
  })
  musicians: Musician[];

  @ManyToMany(() => MusicianBand, (musicianBand) => musicianBand.instruments, {
    onDelete: 'CASCADE',
  })
  groups: MusicianBand;
}
