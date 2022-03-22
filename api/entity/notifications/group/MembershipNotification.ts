import { Notification, Groups } from '../../index';
import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Membership } from '../../MusicianGroup';

/**
 * @description This notification is used when a member of a group
 * has a new membership
 */
@ChildEntity()
export class MembershipNotification extends Notification {
  @ManyToOne(() => Groups, (groups) => groups.id, {
    primary: true,
    onDelete: 'CASCADE',
  })
  group: Groups;

  @Column({
    type: 'enum',
    enum: ['pending', 'member', 'admin', 'declined', 'lite_admin'],
  })
  membership: Membership;
}
