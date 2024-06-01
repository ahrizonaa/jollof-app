import { User as GoogleUserType } from '@codetrix-studio/capacitor-google-auth';
import { UserProfile } from './UserProfile';

export type GoogleUser = GoogleUserType;

export type FacebookUser = {
  email: string;
  id: string;
  name: string;
  picture: {
    height: number;
    width: number;
    is_silhouette: boolean;
    url: string;
  };
};

export type User = {
  email: string;
  name: string;
  imgUrl?: string;
  id: string;
  GoogleUser?: User | null;
  FacebookUser?: FacebookUser | null;
  profile?: UserProfile;
  profilePhotoUrl?: string;
};
