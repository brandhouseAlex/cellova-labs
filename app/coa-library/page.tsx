import type { Metadata } from "next";
import { CoaLibraryExplorer } from "@/components/storefront/coa-library-explorer";
import { getCommerceAdapter } from "@/lib/commerce/provider";
import type { COAData } from "@/lib/commerce/types";

export const metadata: Metadata = { title: "COA Library", description: "Search available Cellova Labs certificate of analysis documents by product, lot, or date." };
export default async function CoaLibraryPage() { let records: COAData[] = []; try { records = (await (await getCommerceAdapter()).getCOAs()).filter((record) => Boolean(record.pdfUrl)); } catch { /* The safe empty state is intentional. */ } return <section className="section"><div className="container"><p className="eyebrow">Documentation / certificate records</p><h1 className="font-display mt-3 text-4xl tracking-[-0.045em] text-[color:var(--indigo)] sm:text-5xl">COA Library.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">Search available certificates by product, lot or batch, and date. Entries are supplied directly from current product documentation.</p><div className="mt-10"><CoaLibraryExplorer records={records} /></div></div></section>; }
