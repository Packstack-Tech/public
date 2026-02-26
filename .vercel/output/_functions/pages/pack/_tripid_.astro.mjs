import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_CNM23SAc.mjs';
import 'piccolore';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { Shirt, Flame, Calendar, Route } from 'lucide-react';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { $ as $$BaseLayout, a as $$PageFooter } from '../../chunks/PageFooter_2CHiteX6.mjs';
export { renderers } from '../../renderers.mjs';

function convertWeight(weight, fromUnit, toUnit) {
  const conversionFactors = {
    g: 1,
    kg: 1e3,
    oz: 28.3495,
    lb: 453.592
  };
  const weightInGrams = weight * conversionFactors[fromUnit];
  const convertedWeight = weightInGrams / conversionFactors[toUnit];
  return {
    weight: convertedWeight,
    display: `${convertedWeight.toFixed(2)} ${toUnit}`
  };
}
function getAggregateUnit(unit) {
  const aggregateUnits = {
    g: "kg",
    kg: "kg",
    oz: "lb",
    lb: "lb"
  };
  return aggregateUnits[unit];
}

const useCategorizedPackItems = (packItems) => {
  const categorizedItems = useMemo(
    () => packItems.reduce((acc, curr) => {
      const catId = curr.item.category_id?.toString() || "uncategorized";
      if (acc[catId]) {
        return {
          ...acc,
          [catId]: { ...acc[catId], items: [...acc[catId].items, curr] }
        };
      }
      return {
        ...acc,
        [catId]: {
          category: curr.item.category,
          items: [curr]
        }
      };
    }, {}),
    [packItems]
  );
  const sorted = useMemo(
    () => Object.entries(categorizedItems).map(([, values]) => {
      values.items.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      return values;
    }).sort(
      (a, b) => (a.category?.sort_order || 0) - (b.category?.sort_order || 0)
    ),
    [categorizedItems]
  );
  return sorted;
};

const ProductName = ({
  item: { brand, product, product_variant, product_url }
}) => {
  const displayName = () => {
    if (!brand && !product_variant && !product) {
      return null;
    }
    if (!product_variant && !product) {
      return brand?.name;
    }
    if (!product_variant) {
      return `${brand?.name} ${product?.name}`;
    }
    return `${brand?.name} ${product?.name} ${product_variant?.name}`;
  };
  const name = displayName();
  if (!name) return null;
  if (product_url) {
    return /* @__PURE__ */ jsx("a", { href: product_url, target: "_blank", rel: "noreferrer", children: name });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: name });
};

const List = ({ items }) => {
  const categorizedItems = useCategorizedPackItems(items);
  const weightTotals = (items2) => {
    const baseUnit = items2[0].item.unit;
    const aggregateUnit = getAggregateUnit(baseUnit);
    const total = items2.reduce((acc, { item, quantity }) => {
      const weight = convertWeight(item.weight || 0, item.unit, aggregateUnit);
      return acc + weight.weight * quantity;
    }, 0);
    return `${total.toFixed(2)} ${aggregateUnit}`;
  };
  return /* @__PURE__ */ jsx("div", { children: categorizedItems.map(({ category, items: items2 }) => {
    const categoryWeight = weightTotals(items2);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "mb-6 border border-surface rounded-md overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-surface px-4 py-2.5", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary text-sm", children: category?.category.name || "Uncategorized" }),
            /* @__PURE__ */ jsx("p", { className: "text-right text-primary text-sm font-semibold", children: categoryWeight })
          ] }),
          /* @__PURE__ */ jsxs("table", { className: "table-fixed w-full", children: [
            /* @__PURE__ */ jsxs("colgroup", { children: [
              /* @__PURE__ */ jsx("col", { className: "w-[35%]" }),
              /* @__PURE__ */ jsx("col", { className: "w-[45%]" }),
              /* @__PURE__ */ jsx("col", { className: "w-[20%]" })
            ] }),
            /* @__PURE__ */ jsx("thead", { className: "text-xs", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4", children: "Item" }),
              /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4", children: "Product" }),
              /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 text-right", children: "Weight" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "text-sm", children: items2.map(({ item, item_id, quantity, worn }) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                item.name,
                worn && /* @__PURE__ */ jsx("span", { title: "Worn", children: /* @__PURE__ */ jsx(Shirt, { size: 14, className: "text-primary" }) }),
                item.consumable && /* @__PURE__ */ jsx("span", { title: "Consumable", children: /* @__PURE__ */ jsx(Flame, { size: 14, className: "text-accent-orange" }) })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsx(ProductName, { item }) }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-right tabular-nums whitespace-nowrap", children: [
                item.weight,
                " ",
                item.unit,
                quantity > 1 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs text-label bg-surface rounded px-1.5 py-0.5", children: [
                  "×",
                  quantity
                ] })
              ] })
            ] }, item_id)) })
          ] })
        ]
      },
      category?.id
    );
  }) });
};

function computeWeightSummary(items) {
  if (items.length === 0) return null;
  const aggregateUnit = getAggregateUnit(items[0].item.unit);
  let base = 0;
  let worn = 0;
  let consumable = 0;
  let total = 0;
  for (const { item, quantity, worn: isWorn } of items) {
    const w = convertWeight(item.weight || 0, item.unit, aggregateUnit).weight * quantity;
    total += w;
    if (isWorn) {
      worn += w;
    } else if (item.consumable) {
      consumable += w;
    } else {
      base += w;
    }
  }
  const fmt = (v) => `${v.toFixed(2)} ${aggregateUnit}`;
  return { base: fmt(base), worn: fmt(worn), consumable: fmt(consumable), total: fmt(total) };
}
function PackingLists({ packs }) {
  return /* @__PURE__ */ jsx("div", { children: packs.map((pack) => {
    const summary = computeWeightSummary(pack.items);
    return /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "border-b border-border pb-2", children: pack.title }),
      summary && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-1 py-3 text-xs", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-label", children: "Base" }),
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold ml-1.5", children: summary.base })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-label", children: "Worn" }),
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold ml-1.5", children: summary.worn })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-label", children: "Consumable" }),
          /* @__PURE__ */ jsx("span", { className: "text-white font-semibold ml-1.5", children: summary.consumable })
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-label", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "text-primary font-bold ml-1.5", children: summary.total })
        ] })
      ] }),
      /* @__PURE__ */ jsx(List, { items: pack.items })
    ] }, pack.id);
  }) });
}

var DISTANCE_LABEL = /* @__PURE__ */ ((DISTANCE_LABEL2) => {
  DISTANCE_LABEL2["MI"] = "miles";
  DISTANCE_LABEL2["KM"] = "km";
  return DISTANCE_LABEL2;
})(DISTANCE_LABEL || {});

const DATE_FORMAT = "MMM dd, yyyy";
const PackHeader = ({ trip, user }) => {
  const start = trip.start_date ? format(new Date(trip.start_date), DATE_FORMAT) : "-";
  const end = trip.end_date ? format(new Date(trip.end_date), DATE_FORMAT) : "-";
  const dayTrip = start === end;
  return /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl", children: trip.location || trip.title }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-softwhite", children: [
      trip.start_date && /* @__PURE__ */ jsxs("span", { className: "flex items-center text-sm", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4 text-label" }),
        dayTrip ? start : `${start} - ${end}`
      ] }),
      !!(trip.distance ?? 0) && /* @__PURE__ */ jsxs("span", { className: "flex items-center text-sm", children: [
        /* @__PURE__ */ jsx(Route, { className: "mr-2 h-4 w-4 text-label" }),
        trip.distance,
        " ",
        DISTANCE_LABEL[user.unit_distance]
      ] })
    ] })
  ] });
};

const $$Astro = createAstro();
const $$tripid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tripid;
  const { tripid } = Astro2.params;
  const resp = await fetch(`https://api.packstack.io/trip/info/${tripid}`);
  const data = await resp.json();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${data.trip.location} :: Packstack` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-background"> <header class="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50"> <nav class="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 py-3"> <a href="/" class="flex items-center"> <img src="/packstack_logo_white.png" alt="Packstack" class="w-32"> </a> <div class="flex items-center gap-4 md:gap-6"> <a href="https://app.packstack.io/auth/login" class="text-softwhite hover:text-white transition-colors text-sm font-semibold">Login</a> <a href="https://app.packstack.io/auth/register" class="bg-primary hover:bg-primary-dark text-white rounded-md py-1.5 px-4 text-sm font-semibold transition-colors no-underline">Sign Up</a> </div> </nav> </header> <div class="mx-auto mt-8 max-w-6xl px-4 md:px-8 pb-8"> ${renderComponent($$result2, "PackHeader", PackHeader, { "trip": data.trip, "user": data.user })} ${renderComponent($$result2, "PackingLists", PackingLists, { "packs": data.packs })} </div> ${renderComponent($$result2, "PageFooter", $$PageFooter, {})} </div> ` })}`;
}, "/Users/maplethorpej/Projects/packstack/2026/public/src/pages/pack/[tripid].astro", void 0);

const $$file = "/Users/maplethorpej/Projects/packstack/2026/public/src/pages/pack/[tripid].astro";
const $$url = "/pack/[tripid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tripid,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
