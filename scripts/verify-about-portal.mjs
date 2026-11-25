import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.PORTFOLIO_URL || "http://127.0.0.1:3001";
const output = "work/portal-qa";
const viewports = [
  { width: 1920, height: 1080 }, { width: 1855, height: 820 },
  { width: 1440, height: 900 }, { width: 1366, height: 768 },
  { width: 768, height: 1024 }, { width: 390, height: 844 },
];
const browser = await chromium.launch({ channel: "chrome" });
const failures = [];
await mkdir(output, { recursive: true });

try {
  for (const locale of ["en", "pt"]) for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const url = `${base}${locale === "pt" ? "/pt" : ""}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator("[data-portal-motion]").waitFor();
    await page.locator("[data-startup]").waitFor({ state: "hidden" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      const section = document.querySelector('[data-scene-entry="about"]');
      window.scrollTo(0, section.getBoundingClientRect().top + scrollY);
    });
    await page.waitForFunction(() => document.querySelector('[data-scene-entry="about"]')?.hasAttribute("data-about-intro-active"), null, { timeout: 5000 });

    const sample = async (label) => {
      const result = await page.evaluate(() => {
        const track = document.querySelector('[data-scene-entry="about"]');
        const panel = track.querySelector("[data-portal-panel]");
        const content = track.querySelector("[data-about-content]");
        const open = Number(track.style.getPropertyValue("--portal-open")) || 0;
        const circles = [
          { rect: content.getBoundingClientRect(), radius: content.getBoundingClientRect().width / 2 - 16, name: "content" },
          { rect: panel.getBoundingClientRect(), radius: Math.min(innerWidth, innerHeight) * open / 2 - 16, name: "portal" },
        ];
        const selected = ["[data-about-step]"];
        const nodes = [...track.querySelectorAll(selected.join(","))];
        const visible = element => {
          let opacity = 1;
          for (let node = element; node && node !== track; node = node.parentElement) {
            const style = getComputedStyle(node);
            opacity *= Number(style.opacity);
            if (style.visibility === "hidden" || style.display === "none") return false;
          }
          return opacity > .005;
        };
        const violations = [];
        const inside = (rect, circle) => {
          const cx = circle.rect.left + circle.rect.width / 2;
          const cy = circle.rect.top + circle.rect.height / 2;
          return [[rect.left, rect.top], [rect.right, rect.top], [rect.left, rect.bottom], [rect.right, rect.bottom]]
            .every(([x, y]) => Math.hypot(x - cx, y - cy) <= circle.radius + .75);
        };
        for (const element of nodes) {
          if (!visible(element)) continue;
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          for (let text = walker.nextNode(); text; text = walker.nextNode()) {
            if (!text.textContent.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(text);
            for (const rect of range.getClientRects()) {
              if (!rect.width || !rect.height) continue;
              for (const circle of circles) if (!inside(rect, circle)) {
                violations.push({ text: text.textContent.trim(), part: circle.name, bounds: [rect.x, rect.y, rect.width, rect.height], radius: circle.radius, open });
              }
            }
          }
        }
        for (const divider of track.querySelectorAll("[data-about-focus]")) {
          if (!visible(divider)) continue;
          const rect = divider.getBoundingClientRect();
          if (!rect.width || !rect.height) continue;
          for (const circle of circles) if (!inside(rect, circle)) violations.push({ text: "focus divider", part: circle.name, bounds: [rect.x, rect.y, rect.width, rect.height], radius: circle.radius, open });
        }
        return { open, violations, overflow: document.documentElement.scrollWidth > innerWidth + 1, width: innerWidth, height: innerHeight };
      });
      await page.screenshot({ path: `${output}/${viewport.width}x${viewport.height}-${locale}-${label}.png` });
      if (result.overflow) failures.push(`${viewport.width}x${viewport.height} ${locale} ${label}: horizontal overflow`);
      for (const violation of result.violations) failures.push(`${viewport.width}x${viewport.height} ${locale} ${label}: ${JSON.stringify(violation)}`);
      return result;
    };

    await sample("000ms");
    await page.waitForTimeout(300);
    await sample("300ms");
    await page.waitForTimeout(500);
    await sample("800ms");
    await page.waitForFunction(() => {
      const section = document.querySelector('[data-scene-entry="about"]');
      return section?.dataset.portalPassed !== undefined && Number(section.style.getPropertyValue("--portal-open")) === 1;
    }, null, { timeout: 3000 });
    const final = await sample("final");
    assert.equal(final.open, 1, `${viewport.width}x${viewport.height} ${locale}: portal did not finish`);
    await context.close();
    console.log(`${viewport.width}x${viewport.height} ${locale}: checked at 0, 300, 800 ms and final.`);
  }

  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator("[data-portal-motion]").waitFor();
  await page.locator("[data-startup]").waitFor({ state: "hidden" });
  await page.evaluate(() => {
    const section = document.querySelector('[data-scene-entry="about"]');
    window.scrollTo(0, section.getBoundingClientRect().top + scrollY + 2);
  });
  await page.waitForFunction(() => document.querySelector('[data-scene-entry="about"]')?.hasAttribute("data-about-intro-active"));
  await page.waitForFunction(() => document.querySelector('[data-scene-entry="about"]')?.hasAttribute("data-portal-passed"));
  await page.locator("a.language-switch").click();
  await page.waitForURL(url => url.pathname === "/pt" && url.hash === "#sobre");
  await page.locator("[data-portal-motion]").waitFor();
  const switched = await page.evaluate(() => {
    const about = document.querySelector('[data-scene-entry="about"]');
    return { active: about.hasAttribute("data-about-intro-active"), passed: about.hasAttribute("data-portal-passed"), open: Number(about.style.getPropertyValue("--portal-open")) };
  });
  assert.deepEqual(switched, { active: false, passed: true, open: 1 }, "switching EN/PT must preserve the open portal without replaying the entrance");
  await context.close();
  console.log("EN → PT preserves the opened portal without replaying the entrance.");
} finally {
  await browser.close();
}

const uniqueFailures = [...new Set(failures)];
assert.deepEqual(uniqueFailures, [], uniqueFailures.slice(0, 40).join("\n"));
console.log(`Portal geometry passed for ${viewports.length * 2} viewport/language combinations; screenshots: ${output}`);
