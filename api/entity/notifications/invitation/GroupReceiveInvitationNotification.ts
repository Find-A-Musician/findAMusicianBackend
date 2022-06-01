import { Groups, Notification } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

/**
 * @description This notification is used when a group or a musician
 * has receive an invitation
 */

@ChildEntity()
export class GroupReceiveInvitationNotification extends Notification {
  @ManyToOne(() => Groups, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Groups;
}
