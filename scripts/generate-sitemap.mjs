import { existsSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputPath = resolve(import.meta.dirname, "..", "client", "public", "sitemap.xml");
const siteUrl = process.env.VITE_SITE_URL?.trim().replace(/\/+$/, "");

if (!siteUrl) {
  if (existsSync(outputPath)) rmSync(outputPath);
  console.warn("[sitemap] VITE_SITE_URL is unset; no canonical sitemap was generated.");
  process.exit(0);
}

const paths = ["/", "/catalog", "/coa-library", "/research-access", "/policies/terms", "/policies/privacy", "/policies/disclosures"];
const urlEntries = paths.map(path => `  <url><loc>${siteUrl}${path === "/" ? "/" : path}</loc></url>`).join("\n");

writeFileSync(outputPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`);
console.log(`[sitemap] Generated ${outputPath} for ${siteUrl}.`);
