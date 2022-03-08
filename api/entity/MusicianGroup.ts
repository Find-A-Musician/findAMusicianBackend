import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Band } from './Band';
import { Instrument } from './Instrument';
import { Musician } from './Musician';

export enum Membership {
  Pending = 'pending', // Waiting that the musician respond to the invitation
  Member = 'member', // Is a member of the group
  Admin = 'admin', // Is an admin of the group
  Declined = 'declined', // Declined the invitation to join the group
}

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
    enum: Membership,
    default: Membership.Pending,
  })
  membership: Membership;

  @ManyToMany(() => Instrument, (instrument) => instrument.groups, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  instruments: Instrument[];
}
