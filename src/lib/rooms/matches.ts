import { prisma } from '@/lib/prisma';
import { findYoutubeTrailerKey, getMovieDetails, getMovieVideos } from '@/lib/tmdb/queries';

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

  if (members.length === 0) return;

  const likedUserIds = new Set(likedVotes.map((vote) => vote.userId));
  const everyoneLiked = members.every((member) => likedUserIds.has(member.userId));
  if (!everyoneLiked) return;

  await prisma.match.upsert({
    where: { roomId_tmdbMovieId: { roomId, tmdbMovieId } },
    create: { roomId, tmdbMovieId },
    update: {},
  });
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
