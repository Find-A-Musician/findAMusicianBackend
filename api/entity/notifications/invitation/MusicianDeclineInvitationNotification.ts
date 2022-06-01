import { Groups, Notification, Musician } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

/**
 * @description This notification is used when a group or a musician
 * has receive an invitation
 */

@ChildEntity()
export class MusicianDeclineInvitationNotification extends Notification {
  @ManyToOne(() => Groups, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Groups;

  @ManyToOne(() => Musician, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  newMusician: Musician;
}
