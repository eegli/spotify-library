# Spotify Library

![npm](https://img.shields.io/npm/v/spotify-library) ![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/eegli/spotify-auth-token/ci-unit-tests/main)
[![codecov](https://codecov.io/gh/eegli/spotify-library/branch/main/graph/badge.svg?token=KU0SAWVF89)](https://codecov.io/gh/eegli/spotify-library)

### Export your Spotify library to JSON

You will need an access token from Spotify. There are multiple ways to get a token:

1. Go to [http://spotify-starter.nougat.dev/](http://spotify-starter.nougat.dev/) and login with Spotify. Then, copy the access token that is displayed.
   This is a demo Spotify app I made for a [different project](https://github.com/eegli/spotify-web-api-starter) and is save to use - the data only lives in your browser and is not saved anywhere. The page is open-source.

2. Create your own Spotify application for free and use it to get an access token. Create a new app on https://developer.spotify.com/dashboard/applications (or reuse one). Then, grab your Spotify app client secret and client id and [get your token via CLI as described here](https://github.com/eegli/spotify-auth-token). Note that you will need at least the authorization scopes `"user-library-read"`.

Also be aware that Spotify authentication tokens expire after 1h.

## CLI

```bash
npx spotify-library@latest --token <your-spotify-token>
```

This will download your Spotify library in a `light` format to the current working directory. Pass in different options to download the full library (all properties) and/or get the derived track genres and audio features as well.

### Options

| Flag         | **_(required?)_** Description, [opts?]                                    |
| ------------ | ------------------------------------------------------------------------- |
| `--token`    | ✅ Spotify authentication token                                           |
| `--type`     | ❌ Track format. Options: `full` \| `light`. Defaults to `light`          |
| `--genres`   | ❌ Appends derived artist genres to saved tracks. Not included by default |
| `--features` | ❌ Appends audio features to saved tracks. Not included by default        |
| `--outDir`   | ❌ Custom output directory relative to where the script is run            |

### Usage

```bash
# light track output
npx spotify-library@latest --token 123token
```

```bash
# full track output
npx spotify-library@latest --type full --genres --features  --outDir spotify-data --token 123token
```

A `light` track has a reduced set of properties:

```ts
type TrackLight = {
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
```

The `full` has all the track properties from the Spotify API.

Example outputs:

- [Light library with genres and features](examples/library-light.json)
- [Full library with genres and features](examples/library-full.json)
