import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { findYoutubeTrailerKey, getMovieDetails, getMovieVideos } from '@/lib/tmdb/queries';

/**
 * Pure match-detection predicate: true once every member ID is present in
 * the set of user IDs that liked the movie. Split out from checkForMatch so
 * it can be unit tested without a database.
 */
export function isUnanimousMatch(
  memberUserIds: string[],
  likedUserIds: Set<string> | string[],
): boolean {
  if (memberUserIds.length === 0) return false;
  const likedSet = likedUserIds instanceof Set ? likedUserIds : new Set(likedUserIds);
  return memberUserIds.every((id) => likedSet.has(id));
}

/**
 * Called after every vote. Creates a Match once every current room member has
 * a "liked" vote for the same movie. Idempotent — upsert is a no-op if the
 * match already exists (e.g. a member re-votes on a movie already matched).
 */
export async function checkForMatch(roomId: string, tmdbMovieId: number) {
  const [members, likedVotes] = await Promise.all([
    prisma.roomMember.findMany({ where: { roomId }, select: { userId: true } }),
    prisma.vote.findMany({
      where: { roomId, tmdbMovieId, liked: true },
      select: { userId: true },
    }),
  ]);

  const memberUserIds = members.map((member) => member.userId);
  const likedUserIds = likedVotes.map((vote) => vote.userId);
  if (!isUnanimousMatch(memberUserIds, likedUserIds)) return;

  try {
    await prisma.match.upsert({
      where: { roomId_tmdbMovieId: { roomId, tmdbMovieId } },
      create: { roomId, tmdbMovieId },
      update: {},
    });
  } catch (error) {
    // Two members' votes can complete the match at nearly the same instant,
    // racing each other to create the same row — the loser's upsert can
    // still surface the raw unique-constraint error. The match exists
    // either way, so this is a no-op, not a failure.
    const isDuplicateMatch =
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
    if (!isDuplicateMatch) throw error;
  }
}

export async function getLatestMatch(roomId: string) {
  return prisma.match.findFirst({
    where: { roomId },
    orderBy: { matchedAt: 'desc' },
  });
}

export type MatchDetails = {
  tmdbMovieId: number;
  matchedAt: string;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
  trailerKey: string | null;
};

export async function getMatchDetails(
  match: NonNullable<Awaited<ReturnType<typeof getLatestMatch>>>,
): Promise<MatchDetails> {
  const [movie, videos] = await Promise.all([
    getMovieDetails(match.tmdbMovieId),
    getMovieVideos(match.tmdbMovieId),
  ]);

  return {
    tmdbMovieId: match.tmdbMovieId,
    matchedAt: match.matchedAt.toISOString(),
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    voteAverage: movie.vote_average,
    trailerKey: findYoutubeTrailerKey(videos.results),
  };
}
