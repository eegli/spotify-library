jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
    promises: {
      mkdir: jest.fn(),
      writeFile: jest.fn(),
    },
  };
});
jest.mock('axios');

jest.spyOn(global.console, 'info').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn());

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/projects/stuff');

// For tests, throw an error instead of exiting the process
jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error();
});
