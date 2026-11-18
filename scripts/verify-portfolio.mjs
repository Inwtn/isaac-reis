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
    assert.equal(await page.locator('img[src*="portrait"]').count(), 0);
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
      await page.getByRole("status").filter({ hasText: "Sinais completos 3/3" }).waitFor();
      await page.reload();
      await page.getByRole("status").filter({ hasText: "Sinais completos 3/3" }).waitFor();
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
  await english.goto(`${url}/#trabalhos`);
  await english.waitForFunction(() => document.querySelector("[data-orbit-root]").dataset.orbitCurrent === "trabalhos");
  await english.locator("summary").click();
  await english.getByRole("link", {name:"Read in English"}).click();
  await english.waitForURL("**/en#work");
  assert.equal(await english.locator("html").getAttribute("lang"), "en");
  assert.ok(await english.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await english.getByRole("link", {name:/Bank Reconciliation/}).click();
  await english.waitForURL("**/en/work/bank-reconciliation");
  await english.getByRole("heading",{name:"How it works"}).waitFor();
  await english.locator("summary").click();
  await english.getByRole("link",{name:"Ler em português"}).click();
  await english.waitForURL("**/trabalhos/reconciliacao-bancaria");
  await english.getByRole("heading",{name:"Fluxo do projeto"}).waitFor();
  assert.equal(await english.locator("html").getAttribute("lang"), "pt-BR");
  await english.evaluate(() => scrollTo(0,document.documentElement.scrollHeight-innerHeight-80));
  await english.mouse.wheel(0,180);
  await english.waitForURL("**/#trabalhos");
  assert.ok((await english.goto(`${url}/en/privacy`)).ok());
  await english.getByRole("heading",{name:"Privacy",level:1}).waitFor();
  assert.equal((await english.goto(`${url}/en/missing-page`)).status(),404);
  await english.getByRole("heading",{name:"This page doesn’t exist."}).waitFor();
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(url);
  assert.equal(await noJs.locator("[data-orbit-seam]").isVisible(), false);
  assert.equal(await noJs.getByRole("heading",{level:1}).count(), 1);
  assert.equal(await noJs.locator('a[href^="mailto:"]').count(), 1);
  console.log("Troca de idioma, projetos, privacidade, 404, movimento reduzido, conteúdo sem JavaScript e axe: OK.");
} finally { await browser.close(); }
