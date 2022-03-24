import { Notification, Groups, Event } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

/**
 * @description This notification is used when a group has
 * been kicked from an event
 */
@ChildEntity()
export class EventGroupKickNotification extends Notification {
  @ManyToOne(() => Groups, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Groups;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  event: Event;
}
