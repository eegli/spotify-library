import axios from 'axios';
import { parseConfig } from './config';
import type {
  Library,
  MultipleArtists,
  MultipleAudioFeatures,
  TrackFull,
  TrackLight,
  UsersSavedTracks,
} from './types';
import { chunkify, createProgressBar, goodbye, write } from './utils';

export async function library(): Promise<Library<TrackLight | TrackFull>> {
  const config = await parseConfig(process.argv.slice(2));
  try {
    let library: Library<TrackFull | TrackLight> = [];
    let progress = createProgressBar('user library');

    const pagination = {
      nextUrl: <string | null>'https://api.spotify.com/v1/me/tracks',
      start: 0,
      end: 50,
    };

    progress.start(0, 0);
    while (pagination.nextUrl) {
      const { data }: UsersSavedTracks = await axios.get(pagination.nextUrl, {
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
        params: {
          limit: 50,
        },
      });

      progress.setTotal(data.total);
      progress.increment(data.items.length);

      data.items.forEach(el => {
        library.push(el);
      });

      pagination.nextUrl = data.next;
      pagination.start = pagination.end;
      pagination.end += data.limit;
    }

    progress.stop();

    // Reduce library if necessary
    if (config.type === 'normal') {
      library = library.reduce((acc, curr) => {
        acc.push({
          added_at: curr.added_at,
          track: {
            id: curr.track.id,
            name: curr.track.name,
            album: {
              id: curr.track.album.id,
              name: curr.track.album.name,
            },
            artists: curr.track.artists.map(a => ({
              id: a.id,
              name: a.name,
            })),
          },
        });
        return acc;
      }, <Library<TrackLight>>[]);
    }

    // Add genres if specified
    if (config.genres) {
      const artists = library.map(t => t.track.artists.map(a => a.id)).flat();
      const artistIds = new Set<string>(artists);
      const genres: Record<string, string[]> = {};

      // Max 50 items per request to Spotify
      const chunkSize = 50;

      progress = createProgressBar('artists');
      progress.start(artistIds.size, 0);

      for await (const chunk of chunkify(artistIds, chunkSize)) {
        const { data }: MultipleArtists = await axios.get(
          'https://api.spotify.com/v1/artists',
          {
            headers: {
              Authorization: `Bearer ${config.token}`,
            },
            params: {
              ids: chunk.join(','),
            },
          }
        );
        data.artists.forEach(artist => {
          genres[artist.id] = artist.genres;
        });
        progress.increment(chunkSize);
      }
      progress.stop();
      library.forEach(({ track }) => {
        track.genres = track.artists.map(({ id }) => genres[id]);
      });
    }

    // Add audio features if specified
    if (config.features) {
      const songIds = library.map(t => t.track.id);
      const features: Record<string, SpotifyApi.AudioFeaturesObject> = {};

      const chunkSize = 50;
      progress = createProgressBar('audio features');

      progress.start(songIds.length, 0);
      for await (const chunk of chunkify(songIds, 50)) {
        const { data }: MultipleAudioFeatures = await axios.get(
          'https://api.spotify.com/v1/audio-features',
          {
            headers: {
              Authorization: `Bearer ${config.token}`,
            },
            params: {
              ids: chunk.join(','),
            },
          }
        );

        data.audio_features.forEach(f => {
          features[f.id] = f;
        });
        progress.increment(chunkSize);
      }
      progress.stop();
      library.forEach(({ track }) => {
        track.features = features[track.id];
      });
    }

    const outDir = write(config.outDir, 'spotify-library', library);
    console.info("Success! Library written to '%s'", outDir);
    return library;
  } catch (e) {
    goodbye('Something went wrong: ' + e);
  }
}
