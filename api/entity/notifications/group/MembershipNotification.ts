import { Notification, Groups } from '../../index';
import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { Membership } from '../../MusicianGroup';

/**
 * @description This notification is used when a member of a group
 * has a new membership
 */
@ChildEntity()
export class MembershipNotification extends Notification {
  @ManyToOne(() => Groups, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Groups;

  @Column({
    type: 'enum',
    enum: ['pending', 'member', 'admin', 'declined', 'lite_admin'],
  })
  membership: Membership;
}
