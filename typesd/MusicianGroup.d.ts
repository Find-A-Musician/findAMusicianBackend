import { Groups } from './Groups';
import { Instrument } from './Instrument';
import { Musician } from './Musician';
export declare type Membership = 'pending' | 'member' | 'admin' | 'declined';
export declare class MusicianGroup {
  musician: Musician;
  group: Groups;
  membership: Membership;
  instruments: Instrument[];
}
