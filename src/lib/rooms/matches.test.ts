import { isUnanimousMatch } from '@/lib/rooms/matches';

describe('isUnanimousMatch', () => {
  it('is false when no one has voted', () => {
    expect(isUnanimousMatch(['alice', 'bob'], [])).toBe(false);
  });

  it('is false when only some members liked it', () => {
    expect(isUnanimousMatch(['alice', 'bob', 'carol'], ['alice', 'bob'])).toBe(false);
  });

  it('is true once every member has liked it', () => {
    expect(isUnanimousMatch(['alice', 'bob'], ['bob', 'alice'])).toBe(true);
  });

  it('accepts a Set of liked user ids', () => {
    expect(isUnanimousMatch(['alice', 'bob'], new Set(['alice', 'bob']))).toBe(true);
  });

  it('ignores likes from users who are not current members', () => {
    // e.g. someone who liked it and then left the room
    expect(isUnanimousMatch(['alice'], ['alice', 'bob'])).toBe(true);
  });

  it('is false for a room with no members', () => {
    expect(isUnanimousMatch([], ['alice'])).toBe(false);
  });

  it('is false when a member liked it more than once but others have not voted', () => {
    expect(isUnanimousMatch(['alice', 'bob'], ['alice', 'alice'])).toBe(false);
  });
});
