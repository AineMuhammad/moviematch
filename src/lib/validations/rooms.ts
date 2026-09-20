import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, 'Room name is required').max(80),
  genreId: z.coerce.number().int().positive().optional(),
  region: z.string().length(2).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  code: z.string().trim().toUpperCase().length(6, 'Room codes are 6 characters'),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
