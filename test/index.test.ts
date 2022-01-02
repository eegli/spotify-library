import { library } from '../src/';

// This is just done to get 100% coverage
it('exports library', () => {
  expect(library).toBeTruthy();
});
