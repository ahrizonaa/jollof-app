import { User } from '@codetrix-studio/capacitor-google-auth';

export type GoogleUser = User;

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

export type NimbelWearUser = {
  email: string;
  name: string;
  imgUrl: string;
  id: string;
  GoogleUser?: User | null;
  FacebookUser?: FacebookUser | null;
};
