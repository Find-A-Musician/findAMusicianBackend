import { Genre, Notification } from '../../index';
import { ChildEntity, Column, JoinTable, ManyToMany } from 'typeorm';

/**
 * @description This notification is used when an event
 * has been deleted
 */
@ChildEntity()
export class EventDeletedNotification extends Notification {
  @Column('varchar')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('timestamp without time zone')
  startDate: Date;

  @Column('timestamp without time zone')
  endDate: Date;

  @Column('varchar')
  adress: string;

  @ManyToMany(() => Genre, { onDelete: 'CASCADE' })
  @JoinTable()
  genres: Genre[];
}
