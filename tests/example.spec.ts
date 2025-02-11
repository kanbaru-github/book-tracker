import { test, expect, Page } from "@playwright/test";

const TEST_ACCOUNT = "101675658313008166618"

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

test("BookSearch component", async ({ page }) => {
  await page.goto("/");

  await page.fill('input[name="search"]', "test book");
  await page.click('button[aria-label="書籍検索実行"]');

  // `Loading`コンポーネントが表示されるまで待機
  await expect(page.locator(".book-search .loading-circle")).toBeVisible();

  // `Loading`コンポーネントが非表示になるまで待機
  await expect(page.locator(".book-search .loading-circle")).not.toBeVisible();

  // `ul.book-list`が表示されるまで待機
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

  await expect(page.locator(".bookshelf .loading-circle")).toBeVisible();
  await expect(page.locator(".bookshelf .loading-circle")).not.toBeVisible();

  await expect(page.locator(".bookshelf .book-list")).toBeVisible();

  const errors = setupConsoleErrCapture(page);
  expect(errors).toHaveLength(0);
});
