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

  // ユーザーID入力ダイアログが表示されるまで待機
  await expect(page.locator(".bookshelf__dialog")).toBeVisible();
  // ユーザーIDを入力
  await page.fill('input[name="userId"]', TEST_ACCOUNT);
  await page.click('button[aria-label="Google BooksユーザーID設定"]');
  // ダイアログが閉じるまで待機
  await expect(page.locator(".bookshelf__dialog")).not.toBeVisible();
});

test("has title", async ({ page }) => {
  await page.goto("/");

  // タイトルタグ確認
  await expect(page).toHaveTitle(/BOOK TRACKER/);

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});

test.describe("Main Component", () => {
  test("OGP設定", async ({ page }) => {
    await page.goto("/");

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBe("BOOK TRACKER");

    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    expect(ogDescription).toBe("Google Books 拡張アプリ");

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toBe("/book-tracker/react.svg");

    const ogUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content");
    expect(ogUrl).toBe("https://zucky2021.github.io/book-tracker/");
  });

  test("Twitterカード", async ({ page }) => {
    await page.goto("/");

    const twitterCard = await page
      .locator('meta[name="twitter:card"]')
      .getAttribute("content");
    expect(twitterCard).toBe("summary");

    const twitterImage = await page
      .locator('meta[name="twitter:image"]')
      .getAttribute("content");
    expect(twitterImage).toBe(
      "https://zucky2021.github.io/book-tracker/react.svg",
    );
  });

  test("Main visual component", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".main-visual")).toBeVisible();

    const googleBooksLink = page.locator(
      'a[href="https://books.google.co.jp/"]',
    );
    await expect(googleBooksLink).toBeVisible();
    await expect(googleBooksLink).toHaveAttribute("target", "_blank");
    await expect(googleBooksLink).toHaveAttribute("rel", "noopener noreferrer");
  });
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

  await expect(page.locator(".book-search .loading-circle")).not.toBeVisible({
    timeout: 5000,
  });

  await expect(page.locator(".book-search .book-list")).toBeVisible();

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});

test("Bookshelf component", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".bookshelf")).toBeVisible();

  await expect(page.locator(".bookshelf .loading-circle")).not.toBeVisible({
    timeout: 5000,
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
