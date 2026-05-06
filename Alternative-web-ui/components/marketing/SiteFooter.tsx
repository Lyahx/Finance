import Link from "next/link";

type FooterLink = { label: string; href: string };

const PRODUCT: FooterLink[] = [
  { label: "Bireysel", href: "/bireysel" },
  { label: "Kurumsal", href: "/kurumsal" },
  { label: "Geliştirici", href: "/gelistirici" },
  { label: "Fiyatlandırma", href: "#" },
];

const COMPANY: FooterLink[] = [
  { label: "Hakkımızda", href: "#" },
  { label: "Kariyer", href: "#" },
  { label: "Basın", href: "#" },
  { label: "İletişim", href: "#" },
];

const LEGAL: FooterLink[] = [
  { label: "Gizlilik", href: "#" },
  { label: "Kullanım Koşulları", href: "#" },
  { label: "KVKK", href: "#" },
  { label: "Çerezler", href: "#" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-black text-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-6">
              <img
                src="/lyrabit-logo.png"
                alt="LyraBit"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="font-black text-2xl">LyraBit</span>
            </div>
            <p className="text-white/60 max-w-sm leading-relaxed">
              PayPal moves money, we manage it.
              <br />
              Türkiye&apos;nin akıllı finans asistanı.
            </p>
          </div>

          <FooterCol title="Ürün" links={PRODUCT} />
          <FooterCol title="Şirket" links={COMPANY} />
          <FooterCol title="Yasal" links={LEGAL} />
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 LyraBit Finans Teknolojileri A.Ş.</p>
          <p>Bu uygulama hackathon kapsamında demo amaçlıdır.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="md:col-span-2">
      <p className="text-xs font-black uppercase tracking-wider mb-4">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
