import { AxiosResponse } from 'axios';

type PickActual<T, P extends keyof T> = T[P];

export type AppConfig = {
  token: string;
  type: 'full' | 'normal';
  genres: boolean;
  features: boolean;
  outDir: string;
};

export type TrackLight = {
  id: string;
  name: string;
  album: {
    name: string;
    id: string;
  };
  artists: {
    id: string;
    name: string;
  }[];
};

export type TrackFull = PickActual<SpotifyApi.SavedTrackObject, 'track'>;

export type Library<T> = {
  added_at: string;
  track: T & {
    genres?: string[][];
    features?: SpotifyApi.AudioFeaturesObject;
  };
}[];

export type UsersSavedTracks =
  AxiosResponse<SpotifyApi.UsersSavedTracksResponse>;
export type MultipleArtists = AxiosResponse<SpotifyApi.MultipleArtistsResponse>;
export type MultipleAudioFeatures =
  AxiosResponse<SpotifyApi.MultipleAudioFeaturesResponse>;
