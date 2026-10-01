import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import { delimiter, join } from "node:path";

const require = createRequire(import.meta.url);
function loadPackage(name) {
  try { return require(name); } catch {
    for (const bin of (process.env.PATH || "").split(delimiter)) {
      const path = join(bin, "..", name);
      if (existsSync(join(path, "package.json"))) return require(path);
    }
    throw new Error(`Run with npm exec --yes --package=playwright --package=@axe-core/playwright -- node scripts/browser-test.mjs (missing ${name}).`);
  }
}
const { chromium } = loadPackage("playwright");
const AxeBuilder = loadPackage("@axe-core/playwright").default;
const base = (process.env.SMOKE_TEST_URL || "http://localhost:3000").replace(/\/$/, "");
const previewTests = process.env.SMOKE_TEST_PREVIEW === "1";
mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push(error.message));
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks += 1; console.log(`✓ ${message}`); }
async function goto(path) { await page.goto(`${base}${path}`, { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready); }
async function noOverflow(label) {
  const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
  check(dimensions.content <= dimensions.viewport, `${label} has no horizontal overflow (${dimensions.viewport}px)`);
}
async function accessibility(label) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  if (result.violations.length) console.log(JSON.stringify(result.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })), null, 2));
  check(result.violations.length === 0, `${label} passes axe WCAG A/AA checks`);
}
try {
  for (const width of [360, 390, 430, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    await goto("/");
    await noOverflow("Homepage");
    if (width === 1440) await page.screenshot({ path: "artifacts/home-desktop.png" });
    if (width === 390) await page.screenshot({ path: "artifacts/home-mobile.png" });
  }
  await accessibility("Desktop homepage");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/resources", "/resources/digital-careers-field-guide", "/start-here", "/about", "/contact", "/collaborate", "/privacy", "/terms"]) { await goto(path); await noOverflow(path); await accessibility(path); }
  await goto("/");
  await accessibility("Mobile homepage");
  await page.getByRole("button", { name: "Open navigation" }).click();
  check(await page.locator("dialog[open]").isVisible(), "Mobile navigation opens an accessible modal");
  await page.keyboard.press("Tab");
  check(await page.evaluate(() => document.activeElement?.closest("dialog") !== null), "Focus remains inside the mobile drawer");
  await page.keyboard.press("Escape");
  check(await page.locator("dialog[open]").count() === 0, "Escape closes mobile navigation");
  check(await page.getByRole("button", { name: "Open navigation" }).evaluate((el) => document.activeElement === el), "Drawer returns focus to its trigger");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("dialog").getByRole("link", { name: "Start Here", exact: true }).click();
  await page.waitForURL("**/start-here");
  check(await page.locator("dialog[open]").count() === 0, "Selecting a mobile navigation link closes the drawer");
  await page.getByRole("tab", { name: "Digital marketing", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  check(await page.getByRole("tab", { name: "Virtual assistance", exact: true }).getAttribute("aria-selected") === "true", "Career tabs support arrow-key selection");
  await page.getByRole("tab", { name: "Data & analytics", exact: true }).click();
  check(await page.getByRole("tabpanel").getByRole("heading", { name: "Data & analytics" }).isVisible(), "Career explorer updates the content panel");
  await accessibility("Career explorer");
  await goto("/resources");
  await page.getByRole("searchbox", { name: "Search resources" }).fill("freelance");
  check(await page.locator(".resource-card").count() === 1, "Resource search filters the library");
  await page.getByRole("searchbox", { name: "Search resources" }).fill("");
  await page.getByRole("button", { name: "Tools & Templates", exact: true }).click();
  check(await page.getByRole("heading", { name: "Nothing here just yet." }).isVisible(), "Empty categories have an honest useful empty state");
  await page.getByRole("button", { name: "View all resources", exact: true }).click();
  check(await page.locator(".resource-card").count() === 3, "Library reset restores all resources");
  await accessibility("Resource library");
  await goto("/resources/digital-careers-field-guide");
  await page.screenshot({ path: "artifacts/guide-mobile.png" });
  await accessibility("Guide landing page");
  const faq = page.locator(".faq-item").first();
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  check(await faq.getAttribute("open") !== null, "FAQ accordion opens from the keyboard");
  await page.getByRole("button", { name: "Send me the free guide", exact: true }).click();
  check(await page.getByRole("alert").filter({ hasText: "Enter a valid email" }).isVisible(), "Email form gives an accessible validation error");
  if (previewTests) {
    check(await page.getByText("Preview mode: email delivery is not connected yet.", { exact: true }).isVisible(), "Guide form clearly identifies preview mode");
    await page.getByRole("textbox", { name: "Your email address", exact: true }).fill("browser-preview@example.com");
    await page.getByRole("button", { name: "Send me the free guide", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Preview only" }).waitFor();
    check(await page.getByRole("status").filter({ hasText: "no guide email was sent" }).isVisible(), "Guide preview never claims email delivery");
  }
  await goto("/contact");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  check(await page.locator(".error-summary").isVisible(), "Contact form reports required-field errors");
  await accessibility("Contact form with errors");
  if (previewTests) {
    check(await page.getByText(/Preview mode. This form validates/).isVisible(), "Contact form identifies preview mode before submission");
    await page.getByRole("textbox", { name: "Your name", exact: true }).fill("Browser Preview");
    await page.getByRole("textbox", { name: "Email address", exact: true }).fill("browser-preview@example.com");
    await page.getByRole("combobox").selectOption("Resource question");
    await page.getByRole("textbox", { name: "Your message", exact: true }).fill("This is only a browser validation preview, not a real enquiry.");
    await page.getByRole("button", { name: "Send message", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Preview only" }).waitFor();
    check(await page.getByRole("status").filter({ hasText: "hasn’t been sent or saved" }).isVisible(), "Contact preview never reports real delivery");
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  await goto("/resources/digital-careers-field-guide");
  await page.screenshot({ path: "artifacts/guide-desktop.png" });
  check(browserErrors.length === 0, `Browser has no uncaught errors: ${browserErrors.join(", ")}`);
  console.log(`\nPassed ${checks} browser checks. Screenshots saved in artifacts/.`);
} finally { await browser.close(); }
