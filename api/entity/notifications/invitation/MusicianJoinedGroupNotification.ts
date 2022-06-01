import { Groups, Musician, Notification } from '../../index';
import { ChildEntity, ManyToOne } from 'typeorm';

/**
 * @description This notification is used when a group or a musician
 * has receive an invitation
 */

@ChildEntity()
export class MusicianJoinedGroupNotification extends Notification {
  @ManyToOne(() => Musician, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  newMusician: Musician;

  @ManyToOne(() => Groups, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  group: Groups;
}
