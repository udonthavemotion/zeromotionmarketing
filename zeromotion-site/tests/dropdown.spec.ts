import { test, expect } from "@playwright/test";

test.describe("Services dropdown behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("contains 4 links with correct hrefs", async ({ page }) => {
    const links = page.locator('[data-dd-panel="services"] a[role="menuitem"]');
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveAttribute("href", "/services/web-design");
    await expect(links.nth(1)).toHaveAttribute(
      "href",
      "/services/brand-identity",
    );
    await expect(links.nth(2)).toHaveAttribute("href", "/ad-campaigns");
    await expect(links.nth(3)).toHaveAttribute(
      "href",
      "/services/ai-integration",
    );
  });

  test("hover intent keeps panel open between trigger and panel", async ({
    page,
  }) => {
    const trigger = page.locator('[data-dd-trigger="services"]');
    const panel = page.locator('[data-dd-panel="services"]');
    await trigger.hover();
    await page.waitForTimeout(250);
    await expect(panel).toHaveAttribute("data-open", "true");
    // move between trigger and panel
    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();
    if (triggerBox && panelBox) {
      await page.mouse.move(
        triggerBox.x + triggerBox.width / 2,
        triggerBox.y + triggerBox.height + 2,
      );
      await page.mouse.move(panelBox.x + 10, panelBox.y + 10);
      await page.waitForTimeout(100);
      await expect(panel).toHaveAttribute("data-open", "true");
    }
  });

  test("Escape closes panel", async ({ page }) => {
    const trigger = page.locator('[data-dd-trigger="services"]');
    const panel = page.locator('[data-dd-panel="services"]');
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
    await expect(panel).toHaveAttribute("data-open", "true");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    await expect(panel).not.toHaveAttribute("data-open", "true");
  });

  test("Tab from trigger focuses first item", async ({ page }) => {
    const trigger = page.locator('[data-dd-trigger="services"]');
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250);
    const first = page
      .locator('[data-dd-panel="services"] [role="menuitem"]')
      .first();
    await expect(first).toBeFocused();
  });

  test("mobile tap opens, outside tap closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const trigger = page.locator('[data-dd-trigger="services"]');
    const panel = page.locator('[data-dd-panel="services"]');
    await trigger.click({ force: true });
    await page.waitForTimeout(250);
    await expect(panel).toHaveAttribute("data-open", "true");
    await page.mouse.click(5, 5);
    await page.waitForTimeout(450);
    await expect(panel).not.toHaveAttribute("data-open", "true");
  });
});
