const fs = require("fs");
const j = JSON.parse(fs.readFileSync("lighthouse-report.json", "utf8"));
const c = j.categories;
console.log("Performance", Math.round(c.performance.score * 100));
console.log("Accessibility", Math.round(c.accessibility.score * 100));
console.log("BestPractices", Math.round(c["best-practices"].score * 100));
console.log("SEO", Math.round(c.seo.score * 100));
