import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Band } from './Band';
import { Musician } from './Musician';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @ManyToMany(() => Musician, (musician) => musician.genres, {
    onDelete: 'CASCADE',
  })
  musicians: Musician[];

  @ManyToMany(() => Band, (band) => band.genres, { onDelete: 'CASCADE' })
  groups: Band[];
}
