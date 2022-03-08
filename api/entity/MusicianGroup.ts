import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Band } from './Band';
import { Instrument } from './Instrument';
import { Musician } from './Musician';

export type Membership = 'pending' | 'member' | 'admin' | 'declined';

@Entity()
export class MusicianBand {
  @ManyToOne(() => Musician, (musician) => musician.musicianGroups, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  musician: Musician;

  @ManyToOne(() => Band, (band) => band.musicianBands, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  group: Band;

  @Column({
    type: 'enum',
    enum: ['pending', 'member', 'admin', 'declined'],
    default: 'pending',
  })
  membership: Membership;

  @ManyToMany(() => Instrument, (instrument) => instrument.groups, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  instruments: Instrument[];
}
