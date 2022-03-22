import { Notification, Groups } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

@ChildEntity()
export class GroupKickNotification extends Notification {
  @ManyToOne(() => Groups, (groups) => groups.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  group: Groups;
}
