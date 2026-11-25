import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:3000";
const output = "work/qa";
await mkdir(output, {recursive: true});
const browser = await chromium.launch({channel: "chrome"});
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:720}]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    assert.ok((await page.goto(url)).ok());
    await page.locator("[data-orbit-ready]").waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.getByRole("heading",{level:1}).count(), 1);
    assert.ok(await page.locator('img[src*="isaac-avatar-full"]').count() >= 1);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.ok(await page.locator(".language-track").first().evaluate(node => !node.closest("details")));
    const canvas = page.locator("canvas:not([data-pixel-cursor])");
    const cell = viewport.width <= 760 ? 3 : 4;
    assert.ok(await canvas.evaluate((el, size) => el.getBoundingClientRect().width === el.width * size && getComputedStyle(el).imageRendering === "pixelated", cell));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({path:`${output}/orbit-${viewport.width}.png`, animations:"disabled"});
    if (viewport.width === 1440) {
      await page.mouse.move(700, 270);
      await page.mouse.move(720, 290);
      await page.waitForFunction(() => {
        const layer = document.querySelector("[data-pixel-cursor]");
        return layer.getContext("2d").getImageData(685,255,75,75).data.some((value,i) => i % 4 === 3 && value > 0);
      });
    }
    for (let lap = 0; lap < 2; lap++) {
      const ending = await page.locator("[data-orbit-seam]").evaluate(e => e.getBoundingClientRect().top + scrollY);
      await page.evaluate(y => window.scrollTo(0, y - 120), ending);
      await page.waitForFunction(y => scrollY >= y - 121, ending);
      await page.mouse.wheel(0, 200);
      await page.waitForFunction(() => scrollY < 110);
    }
    await page.goto(`${url}/#contact`);
    await page.waitForFunction(() => Math.abs(document.getElementById("contact").getBoundingClientRect().top) <= 80);
    await page.waitForFunction(() => document.querySelector("[data-orbit-link=contact][aria-current=location]"));
    if (viewport.width === 1440) {
      for (const sector of ["trabalhos", "sobre", "contato"]) {
        const signal = page.locator(`[data-signal=${sector}]`);
        await signal.click();
        assert.equal(await signal.getAttribute("aria-pressed"), "true");
      }
      await page.getByRole("status").filter({ hasText: "All signals collected 3/3" }).waitFor();
      await page.reload();
      await page.getByRole("status").filter({ hasText: "All signals collected 3/3" }).waitFor();
      const result = await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
      assert.deepEqual(result.violations.map(v => v.id), []);
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`Viewport ${viewport.width}×${viewport.height}: dois ciclos de rolagem e contato direto.`);
  }
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(url);
  assert.equal(await reduced.locator("[data-pixel-cursor]").isVisible(), false);
  assert.equal(await reduced.locator("[data-orbit-seam]").isVisible(), false);
  await reduced.locator("#contact").scrollIntoViewIfNeeded();
  assert.ok(await reduced.evaluate(() => scrollY > 0));
  const english = await browser.newPage({viewport: {width:320,height:720}});
  await english.goto(`${url}/#work`);
  await english.waitForFunction(() => document.querySelector("[data-orbit-root]").dataset.orbitCurrent === "work");
  await english.getByRole("link", {name:"Ler em português"}).click();
  await english.waitForURL("**/pt#trabalhos");
  assert.equal(await english.locator("html").getAttribute("lang"), "pt-BR");
  assert.ok(await english.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await english.getByRole("link", {name:/Conciliação bancária/}).click();
  await english.waitForURL("**/pt/trabalhos/reconciliacao-bancaria");
  await english.getByRole("heading",{name:"Fluxo do projeto"}).waitFor();
  await english.getByRole("link",{name:"Read in English"}).click();
  await english.waitForURL("**/work/bank-reconciliation");
  await english.getByRole("heading",{name:"How it works"}).waitFor();
  assert.equal(await english.locator("html").getAttribute("lang"), "en");
  await english.locator("[data-orbit-ready]").waitFor();
  await english.evaluate(() => scrollTo(0,document.documentElement.scrollHeight-innerHeight-80));
  await english.mouse.move(160, 400);
  await english.mouse.wheel(0,180);
  await english.waitForURL("**/#work");
  assert.ok((await english.goto(`${url}/privacy`)).ok());
  await english.getByRole("heading",{name:"Privacy",level:1}).waitFor();
  assert.equal((await english.goto(`${url}/missing-page`)).status(),404);
  await english.getByRole("heading",{name:"This page doesn’t exist."}).waitFor();
  for (const [home, section] of [["/", "education"], ["/pt", "formacao"]]) {
    const page = await browser.newPage();
    await page.goto(`${url}${home}?preview=1#${section}`);
    await page.waitForFunction(() => scrollY > 0);
    await page.reload();
    assert.equal(new URL(page.url()).hash, "");
    assert.equal(new URL(page.url()).search, "?preview=1");
    await page.waitForFunction(() => scrollY === 0 && history.scrollRestoration === "auto", null, {timeout: 5000});
    await page.locator("#" + section).scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(() => scrollY > 0));
    await page.reload();
    await page.waitForFunction(() => scrollY === 0 && history.scrollRestoration === "auto", null, {timeout: 5000});
    await page.close();
  }
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(url);
  assert.equal(await noJs.locator("[data-orbit-seam]").isVisible(), false);
  assert.equal(await noJs.getByRole("heading",{level:1}).count(), 1);
  assert.equal(await noJs.locator('a[href^="mailto:"]').count(), 1);
  console.log("Troca de idioma, projetos, privacidade, 404, movimento reduzido, conteúdo sem JavaScript e axe: OK.");
} finally { await browser.close(); }
