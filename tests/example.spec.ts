import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // タイトルタグ確認
  await expect(page).toHaveTitle(/BOOK TRACKER/);
});

test('BookSearch component', async ({ page }) => {
  await page.goto('/');

  await page.fill('input[name="search"]', 'test book');
  await page.click('button[aria-label="検索実行"]');

  // Expect an element to be visible.
  await expect(page.getByText('検索中...')).toBeVisible();

  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await expect(errors).toHaveLength(0);
});

test('Bookshelf component', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('section.bookshelf')).toBeVisible();

  await expect(page.locator('ul.book-list')).toBeVisible();

  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  await expect(errors).toHaveLength(0);
});
