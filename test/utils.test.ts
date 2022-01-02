import fs from 'fs';
import { chunkify, write } from '../src/utils';

const mockFS = fs as jest.Mocked<typeof fs>;

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
    ['tmp', 'test', { data: true }],
    ['tmp/dir', 'test.json', { data: true }],
    ['/tmp/dir/', 'test', { data: true }],
    ['../dir', 'test.json', { data: true }],
  ];
  writeParams.forEach((args, idx) => {
    it(`writes data, ${idx}`, () => {
      write(...args);
      expect(mockFS.writeFileSync).toHaveBeenCalledTimes(1);
      const outDirPath = (
        mockFS.writeFileSync.mock.calls[0][0] as string
      ).replace(/\\|\//gi, '/');

      expect(outDirPath).toMatchSnapshot(`write file, ${idx}`);
    });
  });
});
