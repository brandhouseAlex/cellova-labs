import Image from "next/image";
import Link from "next/link";

const FORMATS = [
  { title: "Vials", description: "Precision-filled lyophilized peptides", href: "/collections/vials", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/uMBuGrdqAoFXAFrr.webp" },
  { title: "Capsules", description: "Convenient research support", href: "/collections/capsules", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/USyLoFksqcyKXJTv.webp" },
  { title: "Serums", description: "High-purity liquid formulations", href: "/collections/serums", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/iNFPyAHYuBglIDTL.png" },
  { title: "Nasal Sprays", description: "Advanced delivery solutions", href: "/collections/sprays", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/ivCPJwyolnitDVCK.png" },
] as const;

export function ResearchFormats() {
  return <section className="border-y border-[#ECECE8] bg-[#F7F7F4] py-10 sm:py-14" aria-labelledby="research-formats-heading">
    <div className="home-page-container grid gap-8 lg:grid-cols-[24.5%_75.5%] lg:gap-10">
      <div className="lg:pt-2">
        <p className="section-eyebrow !text-[#2D3452]">Research Formats</p>
        <h2 id="research-formats-heading" className="mt-4 font-display text-[clamp(2.4rem,3.35vw,3.35rem)] font-bold leading-[1.02] tracking-[-.055em] text-ink">Multiple formats.<br /><span className="text-[#2D3452]">One standard.</span></h2>
        <p className="mt-3 max-w-[15rem] text-[15px] font-medium leading-6 text-[#8B93A7]">Choose the format that works best for your research.</p>
        <Link href="/products" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-[7px] bg-[#2D3452] px-4 text-sm font-bold text-paper transition-colors hover:bg-[#F2A63C] hover:text-[#2D3452]">View All Products <span aria-hidden="true">→</span></Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FORMATS.map((format) => <Link key={format.title} href={format.href} className="group flex min-h-[15rem] flex-col rounded-[13px] border border-[#8B93A7]/35 bg-paper p-5 text-center transition-all hover:-translate-y-0.5 hover:border-[#F2A63C] hover:shadow-[0_12px_25px_-20px_rgba(45,52,82,.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2A63C]">
          <div className="relative h-32 overflow-hidden rounded-[10px] bg-[#2D3452]/5 sm:h-36"><Image src={format.image} alt={`Cellova Labs ${format.title} research format`} fill sizes="(min-width: 1280px) 18vw, (min-width: 640px) 36vw, 88vw" className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.035]" /></div>
          <h3 className="mt-3 font-display text-xl font-bold tracking-[-.035em] text-[#2D3452]">{format.title}</h3>
          <p className="mt-1 min-h-10 text-xs font-medium leading-4 text-[#8B93A7]">{format.description}</p>
          <span className="mt-auto pt-3 text-xl text-[#F2A63C] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
