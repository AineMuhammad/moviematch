import { test, expect, type Page } from '@playwright/test';

async function signUp(page: Page, name: string, email: string) {
  await page.goto('/sign-up');
  await page.getByLabel('Name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('correcthorsebattery');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('/');
}

test('create room, second member joins, both swipe the same movie, and get a match', async ({
  browser,
}) => {
  const stamp = Date.now();
  const hostContext = await browser.newContext();
  const guestContext = await browser.newContext();
  const hostPage = await hostContext.newPage();
  const guestPage = await guestContext.newPage();

  await signUp(hostPage, 'E2E Host', `e2e-host-${stamp}@example.com`);
  await signUp(guestPage, 'E2E Guest', `e2e-guest-${stamp}@example.com`);

  // Host creates a room.
  await hostPage.goto('/rooms/new');
  await hostPage.getByLabel('Room name').fill(`E2E Room ${stamp}`);
  await hostPage.getByRole('button', { name: 'Create room' }).click();
  await hostPage.waitForURL(/\/rooms\/[A-Z0-9]{6}$/);
  const code = hostPage.url().split('/').pop() as string;

  // Guest joins via the invite link.
  await guestPage.goto(`/rooms/${code}`);
  await expect(guestPage.getByText('2 members')).toBeVisible();

  // Both members open the swipe screen — same room filters, so they see the
  // same ordered deck and the first card is the same movie for both.
  await hostPage.goto(`/rooms/${code}/swipe`);
  await guestPage.goto(`/rooms/${code}/swipe`);

  await hostPage.getByRole('button', { name: 'Like' }).click();
  await guestPage.getByRole('button', { name: 'Like' }).click();

  await expect(hostPage.getByText("It's a match!")).toBeVisible({ timeout: 20_000 });
  await expect(guestPage.getByText("It's a match!")).toBeVisible({ timeout: 20_000 });

  await hostContext.close();
  await guestContext.close();
});
