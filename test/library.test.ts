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
  it('basic library', async () => {
    process.argv = ['', '', '--token', '123', '--type', 'normal'];
    mockAxios.get.mockResolvedValueOnce(RES_USER_SAVED_TRACKS);
    const res = await library();
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(res).toMatchSnapshot();
    expect(writeSpy).toHaveBeenCalledTimes(1);
  });
  it('with genres', async () => {
    process.argv = ['', '', '--token', '123', '--genres'];
    mockAxios.get
      .mockResolvedValueOnce(RES_USER_SAVED_TRACKS)
      .mockResolvedValueOnce(RES_MULTIPLE_ARTISTS);
    const res = await library();
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(res).toMatchSnapshot();
  });
  it('with audio features', async () => {
    process.argv = ['', '', '--token', '123', '--features'];
    mockAxios.get
      .mockResolvedValueOnce(RES_USER_SAVED_TRACKS)
      .mockResolvedValueOnce(RES_MULTIPLE_AUDIO_FEATURES);
    const res = await library();
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(res).toMatchSnapshot();
  });
  it('with all', async () => {
    process.argv = ['', '', '--token', '123', '--features', '--genres'];
    mockAxios.get
      .mockResolvedValueOnce(RES_USER_SAVED_TRACKS)
      .mockResolvedValueOnce(RES_MULTIPLE_ARTISTS)
      .mockResolvedValueOnce(RES_MULTIPLE_AUDIO_FEATURES);
    const res = await library();
    expect(mockAxios.get).toHaveBeenCalledTimes(3);
    expect(res).toMatchSnapshot();
  });
  it('throws', async () => {
    process.argv = ['', '', '--token', '123'];
    // No axios response
    await expect(library()).rejects.toThrow();
  });
});
