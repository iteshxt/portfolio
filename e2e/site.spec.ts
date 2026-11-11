import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, open, ROUTES, settled, trackErrors } from "./helpers";

test.describe("every page", () => {
  for (const path of ROUTES) {
    test(`${path} renders cleanly`, async ({ page }) => {
      const errors = trackErrors(page);
      await open(page, path);
      await expect(page.locator("main h1:visible").first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
      expect(errors, errors.join("\n")).toEqual([]);
    });

    for (const shift of ["day", "night"] as const) {
      test(`${path} has no accessibility violations (${shift})`, async ({ page }) => {
        await open(page, path, shift);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // Decorative 3D canvas and the hidden print-only resume aren't part of the screen UI.
          .exclude("canvas")
          .exclude("[data-print-resume]")
          .analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× ${v.nodes[0]?.target.join(" ")}`);
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }
  }
});

test("the nav bar finishes the sentence and navigates", async ({ page }) => {
  await open(page, "/");
  await page.getByRole("button", { name: /open navigation/i }).click();
  const input = page.getByRole("combobox");
  await expect(input).toBeFocused();
  await input.fill("patent");
  await input.press("Enter");
  await page.waitForURL("**/work/patentiq");
  await settled(page);
  await expect(page.locator("main h1:visible").first()).toContainText(/patents/i);
});

test("a star card's visual flies into the case-study stage", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 10, 12, 12, 0));
  await open(page, "/work");
  // Clicking low on the card also guards against invisible overlays (the closed nav panel once caught these).
  await page.locator("[data-fly-card]").nth(1).getByText("Case study").click();
  await expect(page.locator("[data-flyer]")).toBeVisible();
  await page.waitForURL("**/work/patentiq");
  await settled(page);
  await expect(page.locator("[data-flyer]")).toBeHidden();
  await expect(page.locator('[data-fly-target="patentiq"]')).toBeVisible();
});

test("peeling the corner switches the shift and remembers it", async ({ page }) => {
  // Midday, so 3am mode (which forces night between 02:00 and 05:00) stays out of it.
  await page.clock.setFixedTime(new Date(2026, 10, 12, 12, 0));
  await page.goto("/");
  await settled(page);
  const before = await page.evaluate(() => document.documentElement.dataset.shift);
  await page.getByRole("button", { name: /switch to the/i }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.shift)).not.toBe(before);
  const after = await page.evaluate(() => document.documentElement.dataset.shift);
  // The choice is saved when the peel animation completes (a drag can still spring back).
  await expect.poll(() => page.evaluate(() => localStorage.getItem("shift"))).toBe(after);
  await page.reload();
  await settled(page);
  expect(await page.evaluate(() => document.documentElement.dataset.shift)).toBe(after);
});

test("unknown pages show the 404", async ({ page }) => {
  await page.goto("/definitely-not-a-page?shift=night");
  await settled(page);
  await expect(page.getByText("The model hallucinated this page.")).toBeVisible();
});

test("printing swaps the site for the resume", async ({ page }) => {
  await open(page, "/work");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("[data-print-resume]")).toBeVisible();
  await expect(page.locator("main").first()).toBeHidden();
});

test("the hidden terminal answers", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut");
  await open(page, "/");
  await page.keyboard.press("Backquote");
  const terminal = page.getByRole("dialog", { name: "Terminal" });
  await expect(terminal).toBeVisible();
  const input = page.getByLabel("Terminal input");
  await input.fill("rm -rf /");
  await input.press("Enter");
  await expect(terminal).toContainText("permission denied, forever");
});

test("Arcee answers from the nav bar (stand-in model)", async ({ page }) => {
  await open(page, "/");
  await page.getByRole("button", { name: /open navigation/i }).click();
  const input = page.getByRole("combobox");
  await input.fill("tell me about sutr");
  await input.press("Enter");
  const chat = page.getByRole("dialog", { name: "Chat with Arcee" });
  await expect(chat).toContainText("stand-in model", { timeout: 15_000 });
  await expect(chat.getByRole("img", { name: /cat/i }).first()).toBeVisible();
});
