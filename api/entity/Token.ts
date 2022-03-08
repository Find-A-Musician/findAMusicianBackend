import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GrantTypes } from '../auth/generateToken';
import { Musician } from '.';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  token: string;

  @Column({ type: 'enum', enum: GrantTypes })
  grandType: GrantTypes;

  @ManyToOne(() => Musician, { onDelete: 'CASCADE' })
  musician: Musician;
}
