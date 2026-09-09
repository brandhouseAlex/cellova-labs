import Image from "next/image";
import Link from "next/link";

const FORMATS = [
  { title: "Vials", description: "Precision-filled lyophilized peptides", href: "/collections/vials", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/CVzBWYPsxZmtMOCa.png" },
  { title: "Capsules", description: "Convenient research support", href: "/collections/capsules", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/KxKqnhDyAfksyKUY.png" },
  { title: "Serums", description: "High-purity liquid formulations", href: "/collections/serums", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/wiWHkEBMMcYVKZaZ.png" },
  { title: "Nasal Sprays", description: "Advanced delivery solutions", href: "/collections/sprays", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663938836977/qqKBQCUxyHpGZTjm.png" },
] as const;

export function ResearchFormats() {
  return <section className="border-y border-[#ECECE8] bg-[#F7F7F4] py-10 sm:py-14" aria-labelledby="research-formats-heading">
    <div className="home-page-container grid gap-8 lg:grid-cols-[minmax(0,24.5fr)_minmax(0,75.5fr)] lg:gap-10">
      <div className="lg:pt-2">
        <p className="section-eyebrow !text-[#F2A63C]">Research Formats</p>
        <h2 id="research-formats-heading" className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">Multiple formats.<br /><span className="text-[#2D3452]">One standard.</span></h2>
        <p className="mt-3 max-w-[15rem] text-[15px] font-medium leading-6 text-[#8B93A7]">Choose the format that works best for your research.</p>
        <Link href="/products" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-[7px] bg-[#2D3452] px-4 text-sm font-bold text-paper transition-colors hover:bg-[#F2A63C] hover:text-white">View All Products <span aria-hidden="true">→</span></Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FORMATS.map((format) => <Link key={format.title} href={format.href} className="group flex min-h-[15rem] flex-col rounded-[13px] border border-[#8B93A7]/35 bg-[linear-gradient(145deg,#FFFFFF_0%,#F3F4F1_58%,#E8ECF0_100%)] p-5 text-center shadow-[0_16px_32px_-28px_rgba(45,52,82,.9)] transition-all hover:-translate-y-0.5 hover:border-[#F2A63C] hover:shadow-[0_18px_34px_-24px_rgba(45,52,82,.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F2A63C]">
          <div className="relative h-32 overflow-hidden rounded-[10px] border border-white/70 bg-[radial-gradient(circle_at_50%_20%,rgba(242,166,60,.18),transparent_44%),linear-gradient(160deg,rgba(45,52,82,.13),rgba(139,147,167,.06)_55%,rgba(255,255,255,.8))] shadow-inner sm:h-36"><span className="pointer-events-none absolute inset-x-[14%] bottom-1 h-5 rounded-[50%] bg-[#2D3452]/12 blur-md" aria-hidden="true" /><Image src={format.image} alt={`Cellova Labs ${format.title} research format`} fill sizes="(min-width: 1280px) 18vw, (min-width: 640px) 36vw, 88vw" className="object-contain p-1.5 mix-blend-multiply drop-shadow-[0_9px_8px_rgba(45,52,82,.2)] transition-transform duration-300 group-hover:scale-[1.035]" /></div>
          <h3 className="mt-3 font-display text-xl font-bold tracking-[-.035em] text-[#2D3452]">{format.title}</h3>
          <p className="mt-1 min-h-10 text-xs font-medium leading-4 text-[#8B93A7]">{format.description}</p>
          <span className="mt-auto pt-3 text-xl text-[#F2A63C] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
