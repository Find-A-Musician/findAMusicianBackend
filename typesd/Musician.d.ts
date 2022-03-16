import { Genre } from './Genre';
import { Instrument } from './Instrument';
import { Event } from './Event';
import { MusicianGroup } from './MusicianGroup';
export declare type Promotion = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
export declare type Location = 'Douai' | 'Lille';
export declare class Musician {
  id: string;
  email: string;
  description: string;
  givenName: string;
  familyName: string;
  phone: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  promotion: Promotion;
  location: Location;
  password: string;
  isLookingForGroups: boolean;
  instruments: Instrument[];
  genres: Genre[];
  musicianGroups: MusicianGroup[];
  adminEvents: Event[];
}
