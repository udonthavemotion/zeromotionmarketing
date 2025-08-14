import fs from "node:fs";
const j = JSON.parse(
  fs.readFileSync(new URL("./lighthouse-report.json", import.meta.url), "utf8"),
);
const c = j.categories;
console.log(
  JSON.stringify(
    {
      performance: Math.round(c.performance.score * 100),
      accessibility: Math.round(c.accessibility.score * 100),
      bestPractices: Math.round(c["best-practices"].score * 100),
      seo: Math.round(c.seo.score * 100),
    },
    null,
    2,
  ),
);
