import { Notification, Groups, Event } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

/**
 * @description This notification is used when a group has
 * been kicked from an event
 */
@ChildEntity()
export class EventGroupKickNotification extends Notification {
  @ManyToOne(() => Groups, (group) => group.id)
  group: Groups;

  @ManyToOne(() => Event, (event) => event.id)
  event: Event;
}
