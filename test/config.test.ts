import { createConfig } from '../src/config';

const consoleSpy = jest.spyOn(console, 'warn');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createConfig', () => {
  [
    ['--token', '123'],
    ['--token', '123', '--type', 'full'],
    ['--token', '123', '--type', 'minimal'],
    ['--token', '123', '--type', 'invalid'],
    ['--token', '123', '--genres', '--features'],
    ['--token', '123', '--genres', '--features', '--outDir', '/data'],
  ].forEach((config, idx) => {
    it(`valid config #${idx}`, () => {
      expect(createConfig(config)).toMatchSnapshot();
    });
  });
  [['--token', '123', '--prop', 'value']].forEach((config, idx) => {
    it(`unknown args #${idx}`, () => {
      createConfig(config);
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toEqual(
        expect.stringMatching(/Ignoring unknown option/gi)
      );
    });
  });
  [[], ['--type', 'full']].forEach((config, idx) => {
    it(`invalid config #${idx}`, () => {
      expect(() => {
        createConfig(config);
      }).toThrow();
    });
  });
});
