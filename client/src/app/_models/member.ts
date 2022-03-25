import {Photo} from "./photo";

export interface Member {
  id: number;
  username: string;
  knownAs: string;
  photoUrl: string;
  age: number;
  created: Date;
  lastActive: Date;
  gender: string;
  lookingFor: string;
  introduction: string;
  interests: string;
  city: string;
  country: string;
  photos: Photo[];
}
