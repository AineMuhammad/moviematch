import { countDistinctVoters } from '@/lib/rooms/votes';

describe('countDistinctVoters', () => {
  it('is 0 for no votes', () => {
    expect(countDistinctVoters([])).toBe(0);
  });

  it('counts each member once regardless of how many votes they cast', () => {
    const votes = [
      { userId: 'alice' },
      { userId: 'alice' },
      { userId: 'alice' },
      { userId: 'bob' },
    ];
    expect(countDistinctVoters(votes)).toBe(2);
  });

  it('counts every distinct member', () => {
    const votes = [{ userId: 'alice' }, { userId: 'bob' }, { userId: 'carol' }];
    expect(countDistinctVoters(votes)).toBe(3);
  });
});
