import { myLib } from './my-lib';

describe('myLib', () => {
  it('returns correct value', () => {
    expect(myLib()).toEqual('This value came from a library!');
  });
});
