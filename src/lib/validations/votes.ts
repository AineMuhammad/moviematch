import { z } from 'zod';

export const castVoteSchema = z.object({
  tmdbMovieId: z.number().int().positive(),
  liked: z.boolean(),
});

export type CastVoteInput = z.infer<typeof castVoteSchema>;
