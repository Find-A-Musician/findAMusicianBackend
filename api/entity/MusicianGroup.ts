import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Groups } from './Groups';
import { Instrument } from './Instrument';
import { Musician } from './Musician';

/**
 * - **lite_admin** : Can modify the group and kick members
 * - **admin** : lite_admin rights && can delete the group
 */
export type Membership =
  | 'pending'
  | 'member'
  | 'admin'
  | 'lite_admin'
  | 'declined';

@Entity()
export class MusicianGroup {
  @ManyToOne(() => Musician, (musician) => musician.musicianGroups, {
    primary: true,
    onDelete: 'CASCADE',
  })
  musician: Musician;

  @ManyToOne(() => Groups, (group) => group.members, {
    primary: true,
    onDelete: 'CASCADE',
  })
  group: Groups;

  @Column({
    type: 'enum',
    enum: ['pending', 'member', 'admin', 'declined', 'lite_admin'],
    default: 'pending',
  })
  membership: Membership;

  @ManyToMany(() => Instrument, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  instruments: Instrument[];
}
