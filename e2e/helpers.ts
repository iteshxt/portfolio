import { expect, type Page } from "@playwright/test";

export const ROUTES = ["/", "/work", "/work/arcee", "/work/patentiq", "/work/diachat", "/dialabs", "/about", "/contact"];

/** Waits until the intro/transition sticker has peeled away. */
export async function settled(page: Page) {
  await page.waitForFunction(() => document.querySelector<HTMLElement>("[data-slap-root]")?.dataset.phase === "idle", undefined, {
    timeout: 15_000,
  });
}

export async function open(page: Page, path: string, shift: "day" | "night" = "day") {
  await page.goto(`${path}${path.includes("?") ? "&" : "?"}shift=${shift}`);
  await settled(page);
}

/** Collects console errors and uncaught exceptions for the page's lifetime. */
export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

export async function expectNoHorizontalOverflow(page: Page) {
  const { scroll, client } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(scroll, "page should not scroll sideways").toBeLessThanOrEqual(client + 1);
}
