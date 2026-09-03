import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** Accessible breadcrumbs with BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(full)),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate">
          {full.map((item, index) => {
            const isLast = index === full.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-line">
                    /
                  </span>
                )}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-ink">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors hover:text-brand"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
