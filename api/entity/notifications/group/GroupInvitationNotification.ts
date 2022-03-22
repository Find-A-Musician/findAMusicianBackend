import { Notification, Groups } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

@ChildEntity()
export class GroupInvitationNotification extends Notification {
  @ManyToOne(() => Groups, (groups) => groups.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  group: Groups;
}
