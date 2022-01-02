jest.spyOn(global.console, 'info').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn());

jest.spyOn(process, 'cwd').mockImplementation(() => '/usr/projects/stuff');

// For tests, throw an error instead of exiting the process
jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error();
});

jest.mock('fs');
jest.mock('axios');
