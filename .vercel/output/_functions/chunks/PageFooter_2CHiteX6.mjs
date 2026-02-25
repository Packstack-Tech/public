import { c as createComponent, a as renderTemplate, l as renderSlot, n as renderHead, o as renderScript, i as addAttribute, b as createAstro, m as maybeRenderHead } from './astro/server_CNM23SAc.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title, description = "Plan your backpacking trips with Packstack \u2014 the free packing list builder and gear tracker for ultralight hikers. Track every ounce, organize by category, and share your setup." } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="utf-8"><link rel="icon" type="image/png" href="/favicon.png"><meta name="viewport" content="width=device-width"><meta name="generator"', '><meta property="og:title" content="Packstack \u2014 Free Backpacking Packing List & Gear Tracker"><meta property="og:description"', '><meta property="og:type" content="website"><meta name="description"', '><meta name="keywords" content="backpacking packing list, ultralight hiking, gear tracker, pack weight, base weight, gear inventory, hiking gear list, lighterpack alternative"><title>', '</title><script async src="https://plausible.io/js/pa-nj_3h0ADLXhz02-M6THrT.js"><\/script>', "", "</head> <body> ", " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(description, "content"), addAttribute(description, "content"), title, renderScript($$result, "/Users/maplethorpej/Projects/packstack/2026/public/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderSlot($$result, $$slots["default"]));
}, "/Users/maplethorpej/Projects/packstack/2026/public/src/layouts/BaseLayout.astro", void 0);

const $$PageFooter = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-border mt-8"> <div class="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6"> <div class="flex items-center gap-6"> <a href="/"> <img src="/packstack_logo_white.png" alt="Packstack" class="w-24"> </a> <span class="text-label text-xs">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Packstack</span> </div> <div class="flex items-center gap-6 text-sm"> <a href="https://app.packstack.io/auth/login" class="text-softwhite hover:text-white transition-colors no-underline">Login</a> <a href="https://app.packstack.io/auth/register" class="text-softwhite hover:text-white transition-colors no-underline">Sign Up</a> </div> </div> </footer>`;
}, "/Users/maplethorpej/Projects/packstack/2026/public/src/components/PageFooter.astro", void 0);

export { $$BaseLayout as $, $$PageFooter as a };
