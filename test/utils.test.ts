import fs from 'fs';
import { defaultConfig } from '../src/config';
import { chunkify, write } from '../src/utils';

const mockFS = fs.promises as jest.Mocked<typeof fs.promises>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Utils', () => {
  it('chunkify with arr', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(chunkify(arr, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });

  it('chunkify with set', () => {
    const set = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(chunkify(set, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });

  const writeParams: Parameters<typeof write>[] = [
    [defaultConfig.outDir, 'test', { data: true }],
    ['tmp', 'test', { data: true }],
    ['tmp/dir', 'test.json', { data: true }],
    ['/tmp/dir/', 'test', { data: true }],
    ['../dir', 'test.json', { data: true }],
  ];
  writeParams.forEach((args, idx) => {
    it(`writes data, ${idx}`, async () => {
      const path = await write(...args);
      expect(mockFS.writeFile).toHaveBeenCalledWith(
        path,
        JSON.stringify(args[2], null, 2)
      );
      expect(mockFS.writeFile).toHaveBeenCalledTimes(1);
      const cleanPath = path.replace(/\\|\//gi, '/');
      expect(cleanPath).toMatchSnapshot(`file ${idx}`);
    });
  });
});
