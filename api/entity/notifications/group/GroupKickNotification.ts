import { Notification, Groups } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

@ChildEntity()
export class GroupKickNotification extends Notification {
  @ManyToOne(() => Groups, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Groups;
}
