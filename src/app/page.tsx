"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  FlaskConical,
  Heart,
  Leaf,
  MessageCircle,
  Package,
  Smile,
  Truck,
  Wheat,
} from "lucide-react";

const featureCards = [
  {
    icon: Truck,
    label: "Pesan Hari Ini,",
    detail: "Kirim Besok",
    tone: "mint",
  },
  {
    icon: Package,
    label: "Dikemas Rapi",
    detail: "& Higienis",
    tone: "yellow",
  },
  {
    icon: Wheat,
    label: "3 Level Pedas",
    detail: "Bebas Pilih",
    tone: "mint",
  },
] as const;

const benefits = [
  {
    icon: Leaf,
    title: "Bahan Pilihan",
    detail: "Kualitas Terbaik",
    tone: "mint",
  },
  {
    icon: FlaskConical,
    title: "Tanpa Pengawet",
    detail: "Aman & Alami",
    tone: "yellow",
  },
  {
    icon: Heart,
    title: "Dibuat Fresh",
    detail: "Setiap Hari",
    tone: "mint",
  },
  {
    icon: Smile,
    title: "Renyah & Nagih",
    detail: "Dari Gigitan Pertama",
    tone: "yellow",
  },
] as const;

function Navbar() {
  const router = useRouter();
  return (
    <header className="site-nav font-sans">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="makar-oni home">
          <span className="brand-name">makar-oni</span>
        </Link>
        <div className="nav-actions">
          <a
            className="button button-outline nav-contact"
            href="https://wa.me/6281290158831"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            <span>Contact</span>
          </a>
          <button
            className="button button-mint"
            onClick={() => router.push("/select-date")}
          >
            Order Now
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroText() {
  const router = useRouter();
  return (
    <div className="hero-copy">
      <div className="eyebrow">
        <CalendarDays size={19} />
        Sistem Pesan H-1 Kantor
      </div>
      <h1>Camilan Gurih & Renyah</h1>
      <button
        className="button button-yellow hero-cta mt-4"
        onClick={() => router.push("/select-date")}
      >
        Mulai Pesan Sekarang
        <ArrowRight size={25} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// function FeatureCards() {
//   return <div className="feature-cards" aria-label="Order features">{featureCards.map(({ icon: Icon, label, detail, tone }) => <div className="feature-card" key={label}><span className={`feature-icon ${tone}`}><Icon size={23} strokeWidth={2} /></span><span><strong>{label}</strong><small>{detail}</small></span></div>)}</div>;
// }

function ProductVisual() {
  return (
    <div className="product-stage">
      <Image
        className="floating-macaroni macaroni-left"
        src="/images/dummy-macaroni-right.png"
        alt="Makaroni snack"
        width={150}
        height={150}
      />
      <Image
        className="floating-macaroni macaroni-right"
        src="/images/dummy-macaroni-right1.png"
        alt="Makaroni snack"
        width={100}
        height={100}
      />
      <div className="mint-shape mint-shape-one" />
      <div className="mint-shape mint-shape-two" />
      <div className="pedestal" />
      <div className="pouch-wrap">
        <Image
          className="product-pouch"
          src="/images/dummy-pouch.png"
          alt="makar-oni snack pouch"
          width={390}
          height={500}
          priority
        />
      </div>
    </div>
  );
}

// function BenefitsRow() {
//   return <div className="benefits-row">{benefits.map(({ icon: Icon, title, detail, tone }, index) => <div className="benefit" key={title}><span className={`benefit-icon ${tone}`}><Icon size={23} strokeWidth={2} /></span><span><strong>{title}</strong><small>{detail}</small></span>{index < benefits.length - 1 && <i aria-hidden="true" />}</div>)}</div>;
// }

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <section className="hero-section">
          <HeroText />
          <div className="visual-and-features">
            <ProductVisual />
          </div>
        </section>
      </main>
    </div>
  );
}