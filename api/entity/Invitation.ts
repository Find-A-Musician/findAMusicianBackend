import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Groups } from './Groups';
import { Instrument } from './Instrument';
import { Musician } from './Musician';

export type InvitationType = 'musicianToGroup' | 'groupToMusician';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['musicianToGroup', 'groupToMusician'],
  })
  type: InvitationType;

  @ManyToOne(() => Groups, {
    primary: true,
    onDelete: 'CASCADE',
  })
  group: Groups;

  @ManyToOne(() => Musician, {
    primary: true,
    onDelete: 'CASCADE',
  })
  musician: Musician;

  @ManyToOne(() => Musician, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  invitor: Musician;

  @ManyToMany(() => Instrument, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  instruments: Instrument[];

  @Column('text', { nullable: true })
  description: string;
}
