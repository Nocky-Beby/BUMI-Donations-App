import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const links = [
  { to: "/a-propos", label: "À propos" },
  { to: "/besoins", label: "Nos besoins" },
  { to: "/impact", label: "Impact" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="container-app grid gap-10 py-14 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo compact />
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
            Une plateforme pensée pour renforcer la confiance, la transparence et l’impact social
            autour des enfants vulnérables soutenus par BUMI.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Navigation</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>Lubumbashi, RDC</p>
            <p>info@bumi-rdc.org</p>
            <p>+243 821 115 763</p>
            <p>Lundi - Vendredi : 08h00 - 17h00</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © 2026 BUMI — Gestion centralisée des dons.
      </div>
    </footer>
  );
}
