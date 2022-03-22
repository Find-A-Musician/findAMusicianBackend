import { Genre, Notification } from '../../index';
import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';
import { Location } from '../../Musician';

/**
 * @description This notification is used when a member of a group
 * has a new membership
 */
@ChildEntity()
export class GroupDeletedNotification extends Notification {
  @Column('varchar')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['Douai', 'Lille'],
  })
  location: Location;

  @ManyToMany(() => Genre, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];
}
