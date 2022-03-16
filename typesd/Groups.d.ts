import { BaseEntity } from 'typeorm';
import { Genre } from '.';
import { MusicianGroup } from './MusicianGroup';
import { Event } from './Event';
import { Location } from './Musician';
export declare class Groups extends BaseEntity {
  id: string;
  name: string;
  description: string;
  location: Location;
  genres: Genre[];
  members: MusicianGroup[];
  events: Event[];
}
