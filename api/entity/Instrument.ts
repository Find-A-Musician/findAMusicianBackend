import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Instrument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;
}
