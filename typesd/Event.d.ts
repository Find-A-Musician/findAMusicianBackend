import { Groups } from './Groups';
import { Genre } from './Genre';
import { Musician } from './Musician';
export declare class Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  adress: string;
  genres: Genre[];
  groups: Groups[];
  admins: Musician[];
}
