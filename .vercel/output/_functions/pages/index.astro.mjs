import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CNM23SAc.mjs';
import 'piccolore';
import { $ as $$Image } from '../chunks/_astro_assets_CAlHwlOU.mjs';
import { $ as $$BaseLayout, a as $$PageFooter } from '../chunks/PageFooter_xmzug3kz.mjs';
export { renderers } from '../renderers.mjs';

const dashboardImg = new Proxy({"src":"/_astro/packstack-dashboard.fNYCRm9c.png","width":2796,"height":1916,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/maplethorpej/Projects/packstack/2026/public/src/assets/packstack-dashboard.png";
							}
							
							return target[name];
						}
					});

const inventoryImg = new Proxy({"src":"/_astro/gear-inventory-management.Blw0raFv.png","width":2796,"height":1800,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/maplethorpej/Projects/packstack/2026/public/src/assets/gear-inventory-management.png";
							}
							
							return target[name];
						}
					});

const weightImg = new Proxy({"src":"/_astro/pack-weight-breakdown.DaE_qOhC.png","width":1550,"height":1056,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/maplethorpej/Projects/packstack/2026/public/src/assets/pack-weight-breakdown.png";
							}
							
							return target[name];
						}
					});

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Packstack | Free Backpacking Packing List & Gear Tracker" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-background"> <!-- Header --> <header class="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50"> <nav class="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 py-3"> <a href="/" class="flex items-center"> <img src="/packstack_logo_white.png" alt="Packstack" class="w-32"> </a> <div class="flex items-center gap-4 md:gap-6"> <a href="#features" class="text-softwhite hover:text-white transition-colors text-sm hidden md:inline">Features</a> <a href="https://app.packstack.io/auth/login" class="text-softwhite hover:text-white transition-colors text-sm font-semibold">Login</a> <a href="https://app.packstack.io/auth/register" class="bg-primary hover:bg-primary-dark text-white rounded-md py-1.5 px-4 text-sm font-semibold transition-colors no-underline">Sign Up</a> </div> </nav> </header> <!-- Hero --> <section class="pt-16 pb-8 md:pt-24 md:pb-16 px-4"> <div class="max-w-4xl mx-auto text-center"> <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
Plan Lighter. Pack Smarter.<br class="hidden sm:block">
Hike Further.
</h1> <p class="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
The free gear management and packing list app built for backpackers
          and ultralight hikers. Track every ounce, build detailed lists, and
          share your setup.
</p> <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"> <a href="https://app.packstack.io/auth/register" class="bg-primary hover:bg-primary-dark text-white rounded-md py-3 px-8 font-bold text-lg transition-colors no-underline w-full sm:w-auto text-center">
Get Started Free
</a> <a href="#features" class="border border-border hover:border-softwhite text-softwhite hover:text-white rounded-md py-3 px-8 font-semibold text-lg transition-colors no-underline w-full sm:w-auto text-center">
See How It Works
</a> </div> </div> <!-- Dashboard screenshot in browser frame --> <div class="max-w-6xl mx-auto mt-12 md:mt-16"> <div class="rounded-xl border border-border overflow-hidden shadow-2xl shadow-primary-glow"> <div class="bg-surface flex items-center gap-2 px-4 py-2.5"> <span class="w-3 h-3 rounded-full bg-accent-red/60"></span> <span class="w-3 h-3 rounded-full bg-accent-orange/60"></span> <span class="w-3 h-3 rounded-full bg-accent-green/60"></span> <span class="ml-4 text-label text-xs font-mono">app.packstack.io</span> </div> ${renderComponent($$result2, "Image", $$Image, { "src": dashboardImg, "alt": "Packstack dashboard showing a packing list with categorized gear, weights, and trip details", "class": "w-full block" })} </div> </div> </section> <!-- Features --> <div id="features" class="scroll-mt-20"> <!-- Feature: Gear Inventory --> <section class="py-16 md:py-24 px-4"> <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"> <div class="md:w-5/12"> <h2 class="text-xs uppercase tracking-widest mb-3 font-semibold">Gear Inventory</h2> <h3 class="text-2xl md:text-3xl leading-snug mb-4">Every gram accounted for</h3> <p class="mb-5">
Build a comprehensive gear inventory with detailed specs for every
              item — weight, brand, product, price, and category. Your inventory
              is always at your fingertips when building packing lists.
</p> <ul class="space-y-2.5 text-softwhite text-sm"> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Import from LighterPack or CSV in seconds
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Auto-fill weights from the product database
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Create custom categories for organization
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Track the total value of your kit
</li> </ul> </div> <div class="md:w-7/12"> <div class="rounded-xl border border-border overflow-hidden"> ${renderComponent($$result2, "Image", $$Image, { "src": inventoryImg, "alt": "Packstack gear inventory showing categorized backpacking equipment with weights and product details", "class": "w-full block" })} </div> </div> </div> </section> <!-- Feature: Pack List Builder --> <section class="py-16 md:py-24 px-4 bg-surface/30"> <div class="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12"> <div class="md:w-5/12"> <h2 class="text-xs uppercase tracking-widest mb-3 font-semibold">Pack List Builder</h2> <h3 class="text-2xl md:text-3xl leading-snug mb-4">Build the perfect pack</h3> <p class="mb-5">
Ditch the spreadsheets. Drag items from your inventory, organize
              by category, and fine-tune quantities — all in a clean,
              purpose-built interface. Create multiple packs per trip for base
              camp and day hike setups.
</p> <ul class="space-y-2.5 text-softwhite text-sm"> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Drag-and-drop reordering
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Multiple packs per trip
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Built-in checklist mode
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Mark items as worn or consumable
</li> </ul> </div> <div class="md:w-7/12"> <!-- CSS-only pack list mock --> <div class="rounded-xl border border-border bg-background overflow-hidden select-none" aria-hidden="true"> <!-- Tab bar --> <div class="flex items-center bg-surface border-b border-border"> <div class="py-2.5 px-5 text-sm font-semibold text-white border-b-2 border-primary">Base Pack</div> <div class="py-2.5 px-5 text-sm text-label">Summit Pack</div> </div> <!-- Weight summary --> <div class="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3 border-b border-border text-xs"> <span><span class="text-label">Base</span><span class="text-white font-semibold ml-1.5">8.4 lb</span></span> <span><span class="text-label">Worn</span><span class="text-white font-semibold ml-1.5">2.1 lb</span></span> <span><span class="text-label">Consumable</span><span class="text-white font-semibold ml-1.5">3.2 lb</span></span> <span><span class="text-label">Total</span><span class="text-primary font-bold ml-1.5">13.7 lb</span></span> </div> <!-- Shelter category --> <div class="border-b border-border"> <div class="bg-surface/60 px-5 py-2 text-xs font-semibold text-white uppercase tracking-wider">Shelter</div> <div class="flex items-center justify-between px-5 py-2 text-sm border-b border-border/40"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border-2 border-primary bg-primary/20 flex items-center justify-center text-[10px] text-primary leading-none">&#10003;</span> <span class="text-white truncate">Tent</span> <span class="text-label text-xs hidden sm:inline truncate">Big Agnes &middot; Copper Spur HV UL2</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">42 oz</span> </div> <div class="flex items-center justify-between px-5 py-2 text-sm border-b border-border/40"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border border-border/60"></span> <span class="text-white truncate">Footprint</span> <span class="text-label text-xs hidden sm:inline truncate">Tyvek Ground Sheet</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">5 oz</span> </div> <div class="flex items-center justify-between px-5 py-2 text-sm"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border border-border/60"></span> <span class="text-white truncate">Stakes</span> <span class="text-label text-xs hidden sm:inline truncate">MSR Groundhog Mini &times;6</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">3 oz</span> </div> </div> <!-- Sleep System category --> <div class="border-b border-border"> <div class="bg-surface/60 px-5 py-2 text-xs font-semibold text-white uppercase tracking-wider">Sleep System</div> <div class="flex items-center justify-between px-5 py-2 text-sm border-b border-border/40"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border-2 border-primary bg-primary/20 flex items-center justify-center text-[10px] text-primary leading-none">&#10003;</span> <span class="text-white truncate">Quilt</span> <span class="text-label text-xs hidden sm:inline truncate">Enlightened Equipment &middot; Enigma 20&deg;</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">24 oz</span> </div> <div class="flex items-center justify-between px-5 py-2 text-sm"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border border-border/60"></span> <span class="text-white truncate">Sleeping Pad</span> <span class="text-label text-xs hidden sm:inline truncate">Therm-a-Rest &middot; NeoAir XLite</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">12 oz</span> </div> </div> <!-- Cooking category --> <div> <div class="bg-surface/60 px-5 py-2 text-xs font-semibold text-white uppercase tracking-wider">Cooking</div> <div class="flex items-center justify-between px-5 py-2 text-sm border-b border-border/40"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border border-border/60"></span> <span class="text-white truncate">Stove</span> <span class="text-label text-xs hidden sm:inline truncate">BRS &middot; 3000T</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">0.9 oz</span> </div> <div class="flex items-center justify-between px-5 py-2 text-sm"> <div class="flex items-center gap-3 min-w-0"> <span class="w-4 h-4 shrink-0 rounded border border-border/60"></span> <span class="text-white truncate">Pot</span> <span class="text-label text-xs hidden sm:inline truncate">TOAKS &middot; 750ml Titanium</span> </div> <span class="text-softwhite text-sm tabular-nums shrink-0 ml-4">3.4 oz</span> </div> </div> </div> </div> </div> </section> <!-- Feature: Weight Analysis --> <section class="py-16 md:py-24 px-4"> <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"> <div class="md:w-5/12"> <h2 class="text-xs uppercase tracking-widest mb-3 font-semibold">Weight Analysis</h2> <h3 class="text-2xl md:text-3xl leading-snug mb-4">Know your base weight</h3> <p class="mb-5">
Instantly see how your weight is distributed across categories.
              Packstack separates base weight, worn weight, and consumables so
              you always know exactly what your pack weighs on the trail.
</p> <ul class="space-y-2.5 text-softwhite text-sm"> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Base / worn / consumable breakdown
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Category-level weight visualization
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Toggle between metric and imperial
</li> </ul> </div> <div class="md:w-7/12"> <div class="rounded-xl border border-border overflow-hidden"> ${renderComponent($$result2, "Image", $$Image, { "src": weightImg, "alt": "Weight breakdown pie chart showing pack weight distribution by category with totals", "class": "w-full block" })} </div> </div> </div> </section> <!-- Feature: Share Your Packs --> <section class="py-16 md:py-24 px-4 bg-surface/30"> <div class="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12"> <div class="md:w-5/12"> <h2 class="text-xs uppercase tracking-widest mb-3 font-semibold">Sharing</h2> <h3 class="text-2xl md:text-3xl leading-snug mb-4">Share your setup</h3> <p class="mb-5">
Generate a shareable link for any trip and send it to friends,
              post it on Reddit, or embed it in your trail journal. Recipients
              see a clean, read-only view of your complete packing list with
              weight breakdowns included.
</p> <ul class="space-y-2.5 text-softwhite text-sm"> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
One-click shareable links
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Clean, read-only public view
</li> <li class="flex items-start gap-2.5"> <span class="text-accent-green mt-0.5 text-xs">&#10003;</span>
Full weight breakdown included
</li> </ul> </div> <div class="md:w-7/12 flex justify-center md:justify-start"> <!-- CSS-only share card mock --> <div class="rounded-xl border border-border bg-background overflow-hidden w-full max-w-md select-none" aria-hidden="true"> <div class="bg-surface px-5 py-4 border-b border-border"> <div class="flex items-center gap-3"> <svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <div class="min-w-0"> <div class="font-semibold text-white text-sm truncate">John Muir Trail &mdash; Southbound</div> <div class="text-label text-xs mt-0.5">Jul 15 &ndash; Aug 2, 2026 &middot; 211 mi</div> </div> </div> </div> <div class="px-5 py-4 space-y-4"> <div class="grid grid-cols-4 gap-2"> <div class="bg-surface rounded-lg px-2 py-2 text-center"> <div class="text-[10px] text-label uppercase tracking-wide">Base</div> <div class="text-white font-bold text-sm">8.4 lb</div> </div> <div class="bg-surface rounded-lg px-2 py-2 text-center"> <div class="text-[10px] text-label uppercase tracking-wide">Worn</div> <div class="text-white font-bold text-sm">2.1 lb</div> </div> <div class="bg-surface rounded-lg px-2 py-2 text-center"> <div class="text-[10px] text-label uppercase tracking-wide">Cons.</div> <div class="text-white font-bold text-sm">3.2 lb</div> </div> <div class="bg-surface rounded-lg px-2 py-2 text-center"> <div class="text-[10px] text-label uppercase tracking-wide">Total</div> <div class="text-primary font-bold text-sm">13.7 lb</div> </div> </div> <div class="text-xs text-label">2 packs &middot; 24 items</div> <div class="flex items-center gap-2"> <div class="flex-1 bg-surface rounded-md px-3 py-2 text-xs text-label truncate font-mono">
packstack.io/pack/a1b2c3d4
</div> <div class="bg-primary text-white text-xs font-semibold rounded-md px-4 py-2 whitespace-nowrap">
Copy Link
</div> </div> </div> </div> </div> </div> </section> </div> <!-- Highlights Strip --> <section class="py-16 md:py-20 px-4"> <div class="max-w-5xl mx-auto"> <h2 class="text-center text-white text-2xl md:text-3xl font-bold mb-10">Built for the trail</h2> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"> <div class="rounded-xl border border-border bg-surface/40 p-5 md:p-6 text-center"> <div class="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center"> <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg> </div> <div class="text-white font-semibold text-sm">Multi-Pack</div> <p class="text-label text-xs mt-1 leading-snug">Multiple packs per trip</p> </div> <div class="rounded-xl border border-border bg-surface/40 p-5 md:p-6 text-center"> <div class="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center"> <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg> </div> <div class="text-white font-semibold text-sm">Easy Import</div> <p class="text-label text-xs mt-1 leading-snug">LighterPack &amp; CSV support</p> </div> <div class="rounded-xl border border-border bg-surface/40 p-5 md:p-6 text-center"> <div class="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center"> <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18"></path><circle cx="7" cy="7" r="1.5" fill="currentColor"></circle><circle cx="17" cy="17" r="1.5" fill="currentColor"></circle></svg> </div> <div class="text-white font-semibold text-sm">Any Unit</div> <p class="text-label text-xs mt-1 leading-snug">Metric &amp; imperial</p> </div> <div class="rounded-xl border border-border bg-surface/40 p-5 md:p-6 text-center"> <div class="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center"> <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"></path></svg> </div> <div class="text-white font-semibold text-sm">100% Free</div> <p class="text-label text-xs mt-1 leading-snug">No premium tier, ever</p> </div> </div> </div> </section> <!-- Final CTA --> <section class="py-16 md:py-24 px-4"> <div class="max-w-2xl mx-auto text-center"> <h2 class="text-3xl md:text-4xl text-white font-bold mb-4">Ready to lighten your load?</h2> <p class="text-lg mb-8 leading-relaxed">
Join backpackers and ultralight hikers who plan smarter with
          Packstack. Free to use, no credit card required.
</p> <a href="https://app.packstack.io/auth/register" class="inline-block bg-primary hover:bg-primary-dark text-white rounded-md py-3 px-8 font-bold text-lg transition-colors no-underline">
Create Your Free Account
</a> </div> </section> ${renderComponent($$result2, "PageFooter", $$PageFooter, {})} </div> ` })}`;
}, "/Users/maplethorpej/Projects/packstack/2026/public/src/pages/index.astro", void 0);

const $$file = "/Users/maplethorpej/Projects/packstack/2026/public/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
