import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Rooms stay around for a week after expiring (in case anyone wants to look
// back at a match) before being pruned entirely.
const PRUNE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  const expired = await prisma.room.updateMany({
    where: { status: 'open', expiresAt: { lt: now } },
    data: { status: 'expired' },
  });

  const pruned = await prisma.room.deleteMany({
    where: { status: 'expired', expiresAt: { lt: new Date(now.getTime() - PRUNE_AFTER_MS) } },
  });

  return NextResponse.json({ expired: expired.count, pruned: pruned.count });
}
