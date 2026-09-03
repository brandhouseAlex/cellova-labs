import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/product/product-card";

/**
 * Homepage catalog style: a restrained off-white editorial selection sourced
 * exclusively through the normalized active commerce provider.
 */
const HOME_PRODUCT_LIMIT = 1000;

export async function HomeProductGrid() {
  const result = await commerce.getProducts({ perPage: HOME_PRODUCT_LIMIT, sort: "alphabetical" });

  return <section className="home-product-grid bg-[#F3F4F1] py-20 sm:py-24" aria-labelledby="home-catalog-title">
    <div className="home-page-container">
      <header className="flex flex-col gap-7 border-b border-[#dfe4dc] pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.19em] text-[#D48624]">Explore the catalog</p>
          <h2 id="home-catalog-title" className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">Research Compounds</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate">Explore the complete Cellova Labs catalog of research compounds, peptides, and formulations.</p>
        </div>
      </header>

      {result.items.length === 0 ? <div className="mt-10 border border-[#dfe4dc] bg-white p-10 text-center text-sm text-slate">The catalog is being prepared for review.</div> : <><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
        {result.items.map((product) => <ProductCard key={product.id} product={product} />)}
      </div><div className="mt-12 flex justify-center sm:mt-14"><Link href="/products" className="home-shop-all group inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] bg-[#F2A63C] px-7 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-[#D48624] active:scale-[0.98]">Shop All <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span></Link></div></>}
    </div>
  </section>;
}
