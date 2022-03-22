import { Notification, Groups } from '../../index';
import { ManyToOne } from 'typeorm';

export class GroupKickNotification extends Notification {
  @ManyToOne(() => Groups, (groups) => groups.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  group: Groups;
}
