import { test, expect, Page } from "@playwright/test";
import { configDotenv } from "dotenv";

configDotenv();
const TEST_ACCOUNT = process.env.GOOGLE_BOOKS_USER_ID || "";

/**
 * テストで発生するエラーメッセージを取得
 * @param page PlaywrightのPageオブジェクト
 * @returns コンソールエラーメッセージの配列
 */
const setupConsoleErrCapture = (page: Page) => {
  const errors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  return errors;
};

// localstorageから特定のuserIdを削除
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // 特定のキーのみを削除
  await page.evaluate(() => {
    localStorage.removeItem("googleBooksUserId");
  });
});

test("has title", async ({ page }) => {
  await page.goto("/");

  // タイトルタグ確認
  await expect(page).toHaveTitle(/BOOK TRACKER/);

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});

test("Header component", async ({ page }) => {
  await page.goto("/");

  // 固定ヘッダーのテスト
  await page.evaluate(() => scrollTo(0, 100));
  await expect(page.locator(".header--fixed")).toBeVisible();

  await expect(page.locator(".header")).toBeVisible();
  await page.click('.header a[href="#book-search"]');
  await page.click('.header a[href="#bookshelf"]');
  await page.click('.header a[href="#root"]');

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});

test("BookSearch component", async ({ page }) => {
  await page.goto("/");

  await page.fill('input[name="search"]', "test book");
  await page.click('button[aria-label="書籍検索実行"]');

  await expect(page.locator(".book-search .loading-circle")).toBeVisible({
    timeout: 50000,
  });
  await expect(page.locator(".book-search .loading-circle")).not.toBeVisible();

  await expect(page.locator(".book-search .book-list")).toBeVisible();

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});

test("Bookshelf component", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".bookshelf")).toBeVisible();

  // ユーザーID入力ダイアログが表示されるまで待機
  await expect(page.locator(".bookshelf__dialog")).toBeVisible();
  // ユーザーIDを入力
  await page.fill('input[name="userId"]', TEST_ACCOUNT);
  await page.click('button[aria-label="Google BooksユーザーID設定"]');
  // ダイアログが閉じるまで待機
  await expect(page.locator(".bookshelf__dialog")).not.toBeVisible();

  await expect(page.locator(".bookshelf .loading-circle")).toBeVisible({
    timeout: 50000,
  });
  await expect(page.locator(".bookshelf .loading-circle")).not.toBeVisible();

  await expect(page.locator(".bookshelf__error")).not.toBeVisible();

  const bookListVisible = await page
    .locator(".bookshelf .book-list")
    .isVisible();
  const endMessageVisible = await page
    .locator(".bookshelf__fetch-all-msg")
    .isVisible();
  expect(bookListVisible || endMessageVisible).toBe(true);

  await expect(page.locator(".bookshelf .book-list")).toBeVisible();

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});
