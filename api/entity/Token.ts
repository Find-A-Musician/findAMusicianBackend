import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Musician } from '.';

export type GrantTypes = 'AuthorizationCode' | 'RefreshToken';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  token: string;

  @Column({ type: 'enum', enum: ['AuthorizationCode', 'RefreshToken'] })
  grandType: GrantTypes;

  @ManyToOne(() => Musician, { onDelete: 'CASCADE' })
  musician: Musician;
}
