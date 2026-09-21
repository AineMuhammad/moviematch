/** Number of distinct members who have cast at least one vote. */
export function countDistinctVoters(votes: { userId: string }[]): number {
  return new Set(votes.map((vote) => vote.userId)).size;
}
