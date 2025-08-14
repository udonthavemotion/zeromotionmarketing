import { test, expect } from "@playwright/test";

const NAV_LOGO_SELECTOR = 'header.sticky a[href="/"] img[alt="ZeroMotion"]';

async function getComputedPx(
  page: import("@playwright/test").Page,
  selector: string,
  prop: string,
) {
  return await page.$eval(
    selector,
    (el: Element, propName: string) => {
      const v = window.getComputedStyle(el).getPropertyValue(propName);
      return parseFloat(v);
    },
    prop,
  );
}

test.describe("Navbar logo sizing and stacking", () => {
  test("desktop sizing and stacking", async ({
    page,
  }: {
    page: import("@playwright/test").Page;
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator(NAV_LOGO_SELECTOR)).toHaveCount(0);

    // header stacking check
    const headerZRaw1 = await page.$eval(
      "header.sticky",
      (el) => getComputedStyle(el).zIndex || "50",
    );
    expect(parseInt(headerZRaw1, 10)).toBeGreaterThanOrEqual(0);

    const heroMediaZ1 = await page.$eval(
      "#hero video",
      (el) => getComputedStyle(el).zIndex,
    );
    expect(parseInt(heroMediaZ1 || "0", 10)).toBeLessThan(0);
  });

  test("mobile viewport renders header above hero", async ({
    page,
  }: {
    page: import("@playwright/test").Page;
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator(NAV_LOGO_SELECTOR)).toHaveCount(0);
    const headerZRaw2 = await page.$eval(
      "header.sticky",
      (el) => getComputedStyle(el).zIndex || "50",
    );
    expect(parseInt(headerZRaw2, 10)).toBeGreaterThanOrEqual(0);
    const heroMediaZ2 = await page.$eval(
      "#hero video",
      (el) => getComputedStyle(el).zIndex,
    );
    expect(parseInt(heroMediaZ2 || "0", 10)).toBeLessThan(0);
  });
});
