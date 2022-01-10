import axios from 'axios';
import { library } from '../src/library';
import * as utils from '../src/utils';
import {
  RES_MULTIPLE_ARTISTS,
  RES_MULTIPLE_AUDIO_FEATURES,
  RES_USER_SAVED_TRACKS,
} from './fixtures';

const writeSpy = jest.spyOn(utils, 'write');
const mockAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Library', () => {
  it('throws for missing auth token', async () => {
    process.argv = ['', ''];
    await expect(library()).rejects.toThrow();
  });
  it('throws for failed requests', async () => {
    process.argv = ['', '', '--token', '123x'];
    // No axios response
    await expect(library()).rejects.toThrow();
  });
  it('gets light library', async () => {
    process.argv = ['', '', '--token', '123x'];
    mockAxios.get.mockResolvedValueOnce(RES_USER_SAVED_TRACKS);
    const res = await library();
    expect(res.meta.output_type).toBe('light');
    expect(res.meta.date_generated).toEqual(expect.any(String));
    expect(res.library[0]).toMatchSnapshot('light track');
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });
  it('gets full library', async () => {
    process.argv = ['', '', '--token', '123x', '--type', 'full'];
    mockAxios.get.mockResolvedValueOnce(RES_USER_SAVED_TRACKS);
    const res = await library();
    expect(res.meta.output_type).toBe('full');
    expect(res.meta.date_generated).toEqual(expect.any(String));
    expect(res.library[0]).toMatchObject(RES_USER_SAVED_TRACKS.data.items[0]);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
  });
  it('with genres', async () => {
    process.argv = ['', '', '--token', '123x', '--genres'];
    mockAxios.get
      .mockResolvedValueOnce(RES_USER_SAVED_TRACKS)
      .mockResolvedValueOnce(RES_MULTIPLE_ARTISTS);
    const res = await library();
    expect(res.library[0].track.genres).toBeTruthy();
    expect(res.library[0].track.genres).toMatchSnapshot('genres');
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });
  it('with audio features', async () => {
    process.argv = ['', '', '--token', '123x', '--features'];
    mockAxios.get
      .mockResolvedValueOnce(RES_USER_SAVED_TRACKS)
      .mockResolvedValueOnce(RES_MULTIPLE_AUDIO_FEATURES);
    const res = await library();
    expect(res.library[0].track.features).toBeTruthy();
    expect(res.library[0].track.features).toMatchSnapshot('features');
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
  });
  it('writes library', async () => {
    process.argv = ['', '', '--token', '123x', '--outDir', '/spotify'];
    mockAxios.get.mockResolvedValueOnce(RES_USER_SAVED_TRACKS);
    const res = await library();
    expect(writeSpy.mock.calls[0][0]).toBe('/spotify');
    expect(writeSpy.mock.calls[0][1]).toBe('spotify-library');
    expect(writeSpy.mock.calls[0][2]).toEqual(res);
  });
});
