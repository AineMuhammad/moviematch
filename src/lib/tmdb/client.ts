const TMDB_API_BASE = 'https://api.themoviedb.org/3';

export class TmdbError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'TmdbError';
  }
}

export class TmdbRateLimitError extends TmdbError {
  constructor(public readonly retryAfterSeconds: number | null) {
    super('TMDB rate limit exceeded', 429);
    this.name = 'TmdbRateLimitError';
  }
}

export class TmdbUnavailableError extends TmdbError {
  constructor(status?: number) {
    super('TMDB is currently unavailable', status);
    this.name = 'TmdbUnavailableError';
  }
}

type TmdbFetchOptions = {
  /** Seconds to cache the response for (Next.js fetch cache). Defaults to 1 hour. */
  revalidateSeconds?: number;
};

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  { revalidateSeconds = 3600 }: TmdbFetchOptions = {},
): Promise<T> {
  const token = process.env.TMDB_API_KEY;
  if (!token) {
    throw new TmdbError('TMDB_API_KEY is not configured');
  }

  const url = new URL(`${TMDB_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      next: { revalidate: revalidateSeconds },
    });
  } catch {
    throw new TmdbUnavailableError();
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new TmdbRateLimitError(retryAfter ? Number(retryAfter) : null);
  }

  if (response.status >= 500) {
    throw new TmdbUnavailableError(response.status);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      typeof body === 'object' && body && 'status_message' in body
        ? String((body as { status_message: unknown }).status_message)
        : `TMDB request failed with status ${response.status}`;
    throw new TmdbError(message, response.status);
  }

  return response.json() as Promise<T>;
}
