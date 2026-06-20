import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Package,
  FileText,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Phone,
  Shield,
  Users,
  MapPin,
  ArrowRight,
  HeartHandshake,
  AlertTriangle,
  UtensilsCrossed,
  Bike,
  Gift,
  Pill,
  Building2,
  Briefcase,
  Sparkles,
  Lock,
  Mail,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import heroRider from "@/assets/hero-rider.jpg";
import serviceFood from "@/assets/service-food.jpg";
import serviceEscrow from "@/assets/service-escrow.jpg";
import serviceErrand from "@/assets/service-errand.jpg";

const WHATSAPP_NUMBER = "+237670416449";
const WHATSAPP_DISPLAY = "+237 670 416 449";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${encodeURIComponent(
  "Hi ChopTym, I have a request."
)}`;
const EMAIL = "info@choptym.com";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
} as const;

const stagger = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-80px" },
};

const WhatsAppBtn = ({
  label = "Order on WhatsApp",
  size = "lg",
  className = "",
}: {
  label?: string;
  size?: "lg" | "default";
  className?: string;
}) => (
  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className={className}>
    <Button
      size={size}
      className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold gap-2 shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all rounded-full px-7"
    >
      <MessageCircle className="w-5 h-5" />
      {label}
    </Button>
  </a>
);

const services = [
  { icon: UtensilsCrossed, title: "Food Delivery", desc: "Order meals from restaurants and have them delivered to your home or office." },
  { icon: Package, title: "Parcel & Package Delivery", desc: "Send and receive packages, gifts, business items, and personal parcels." },
  { icon: FileText, title: "Document Delivery", desc: "Fast delivery of contracts, applications, certificates, and important paperwork." },
  { icon: ShoppingBag, title: "Shopping Assistance", desc: "Send us your shopping list and we'll purchase and deliver your items." },
  { icon: Bike, title: "Personal Errands", desc: "Need something picked up, dropped off, purchased, or handled? We save you the trip." },
  { icon: Building2, title: "Government Office Assistance", desc: "Document submissions, certification, file follow-ups, and administrative office visits." },
  { icon: Truck, title: "Business Logistics", desc: "Same-day delivery solutions for shops, pharmacies, restaurants, offices, and businesses." },
  { icon: Pill, title: "Pharmacy Pickups", desc: "Collect prescriptions and health-related purchases on your behalf." },
  { icon: Gift, title: "Gift & Surprise Deliveries", desc: "Deliver gifts, flowers, packages, and special items to loved ones." },
];

const heroChips = [
  { icon: UtensilsCrossed, label: "Food" },
  { icon: Package, label: "Parcels" },
  { icon: Building2, label: "Gov. Errands" },
  { icon: ShoppingBag, label: "Shopping" },
  { icon: Briefcase, label: "Business" },
  { icon: Lock, label: "Escrow" },
];

const steps = [
  "Send your request through WhatsApp.",
  "Our team reviews and confirms the request.",
  "A rider or representative is assigned.",
  "The task is completed and delivered.",
  "You receive confirmation and updates throughout the process.",
];

const escrowSteps = [
  "Customer places an order.",
  "Customer pays ChopTym.",
  "ChopTym purchases or collects the goods.",
  "Goods are delivered to the customer.",
  "Payment is released to the seller after successful delivery and confirmation.",
];

const whyChoose = [
  { icon: Clock, title: "Save Time", desc: "Focus on what matters while we handle the movement." },
  { icon: Sparkles, title: "Affordable", desc: "Designed for local communities and businesses." },
  { icon: CheckCircle2, title: "Reliable", desc: "Professional handling and delivery tracking." },
  { icon: Shield, title: "Trusted", desc: "Secure payment facilitation and verified processes." },
  { icon: HeartHandshake, title: "Flexible", desc: "From food delivery to government errands." },
  { icon: MapPin, title: "Local", desc: "Built specifically for African cities and everyday realities." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <nav className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img
              src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png"
              alt="ChopTym"
              className="w-9 h-9"
            />
            <div className="leading-tight">
              <p className="font-bold text-primary text-base">ChopTym</p>
              <p className="text-[10px] text-muted-foreground hidden sm:block">Chill, we dey bringam.</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <Link to="/order" className="hidden sm:block">
              <Button variant="ghost" size="sm">Order Online</Button>
            </Link>
            <WhatsAppBtn label="WhatsApp" size="default" />
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary)/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.12),transparent_60%)]" />
        {/* Floating blobs */}
        <motion.div
          aria-hidden
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl -z-10"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 mb-5">
              <MapPin className="w-3.5 h-3.5" /> Limbe, Cameroon · Trusted since day one
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
              Chill,{" "}
              <span className="text-gradient">we dey bringam.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-3">
              Food, parcels, shopping, errands, documents, escrow payments — one trusted team handling what matters across the city.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/90 max-w-xl mx-auto lg:mx-0 mb-8">
              Send your request on WhatsApp. We pick up, deliver, and confirm — quickly, affordably, reliably.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-10">
              <WhatsAppBtn label="Order on WhatsApp" />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${encodeURIComponent("Hi ChopTym, I want to become a rider.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-7 border-2 gap-2">
                  <Bike className="w-5 h-5" /> Become a Rider
                </Button>
              </a>
            </div>

            {/* Service chips */}
            <motion.div
              {...stagger}
              initial="initial"
              whileInView="whileInView"
              className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0"
            >
              {heroChips.map((c) => (
                <motion.div
                  key={c.label}
                  variants={{ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card/70 backdrop-blur border border-border/60 hover:border-primary/40 hover:bg-card transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">{c.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-lg"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/30 border border-border/40 aspect-[4/5]"
            >
              <img
                src={heroRider}
                alt="ChopTym rider delivering across Limbe, Cameroon"
                width={1536}
                height={1024}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </motion.div>

            {/* Floating live badges */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -left-3 sm:-left-6 top-8 bg-card/95 backdrop-blur border border-border shadow-xl rounded-2xl p-3 pr-4 flex items-center gap-3"
            >
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </span>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Rider on the way</p>
                <p className="text-sm font-bold">Arriving in 18 min</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              animate-floating
              className="absolute -right-3 sm:-right-6 bottom-10 bg-card/95 backdrop-blur border border-border shadow-xl rounded-2xl p-3 pr-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Order #4421</p>
                <p className="text-sm font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Delivered</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#25D366] text-white shadow-xl rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> Live on WhatsApp
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* WHAT WE DO */}
      <section className="py-16 sm:py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">What we do</p>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">One Platform. Many Services.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ChopTym is your trusted city assistant. If it needs to be delivered, purchased, processed, collected, submitted, or completed — we can help.
            </p>
          </motion.div>

          <motion.div
            {...stagger}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }}
              >
                <Card className="h-full border-border/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-card">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                      <s.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    {i === 5 && (
                      <p className="text-[11px] mt-3 pt-3 border-t border-border/60 text-muted-foreground italic">
                        We facilitate administrative processes and errands. Approval decisions remain solely with the relevant authorities.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">How it works</p>
            <h2 className="text-3xl sm:text-5xl font-bold">Simple. Fast. Reliable.</h2>
          </motion.div>

          <motion.div {...stagger} initial="initial" whileInView="whileInView" className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={{ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } }}
                className="relative p-5 rounded-2xl bg-card border border-border/60"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mb-3 shadow-md">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ESCROW */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-primary/5 via-card/40 to-background">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 mb-4">
              <Lock className="w-3.5 h-3.5" /> Trusted Purchase & Escrow
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Buy Safely. Pay With Confidence.</h2>
            <p className="text-muted-foreground mb-6">
              ChopTym acts as a trusted payment and delivery intermediary between buyers and sellers.
            </p>

            <ol className="space-y-3 mb-6">
              {escrowSteps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-none w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/90">{s}</span>
                </li>
              ))}
            </ol>

            <WhatsAppBtn label="Start a Safe Purchase" />
          </motion.div>

          <motion.div {...fadeUp} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {["Reduced fraud risk", "Trusted transactions", "Remote purchasing", "Marketplace protection", "Peace of mind", "Verified handoff"].map((b) => (
                <div key={b} className="flex items-start gap-2 p-3 rounded-xl bg-card border border-border/60">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-none" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border/60">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Use cases</p>
              <div className="flex flex-wrap gap-2">
                {["Facebook Marketplace", "Instagram sellers", "Remote purchases", "Business transactions", "Online vendors"].map((u) => (
                  <span key={u} className="px-3 py-1.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{u}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Why ChopTym</p>
            <h2 className="text-3xl sm:text-5xl font-bold">Built around you.</h2>
          </motion.div>
          <motion.div {...stagger} initial="initial" whileInView="whileInView" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChoose.map((w) => (
              <motion.div
                key={w.title}
                variants={{ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } }}
                className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all"
              >
                <w.icon className="w-7 h-7 text-primary mb-3" />
                <h3 className="font-bold text-lg mb-1.5">{w.title}</h3>
                <p className="text-sm text-muted-foreground">{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section className="py-16 sm:py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Who we help</p>
            <h2 className="text-3xl sm:text-5xl font-bold">For everyone who moves the city.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Users, title: "Individuals", desc: "Busy professionals, students, families, and residents." },
              { icon: Briefcase, title: "Businesses", desc: "Retail stores, pharmacies, restaurants, offices, and online sellers." },
              { icon: Building2, title: "Government & Admin Users", desc: "People needing assistance navigating paperwork, submissions, and collections." },
            ].map((g) => (
              <motion.div key={g.title} {...fadeUp} className="p-7 rounded-3xl bg-gradient-to-br from-card to-card/70 border border-border/60">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4">
                  <g.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT */}
      <section className="py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Community impact</p>
            <h2 className="text-3xl sm:text-5xl font-bold mb-3">Building Better Cities Through Logistics</h2>
            <p className="text-muted-foreground">Every delivery helps create opportunities.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Helping small businesses reach more customers.",
              "Creating income opportunities for local riders.",
              "Making goods and services more accessible.",
              "Supporting local commerce and economic growth.",
            ].map((t, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/15"
              >
                <HeartHandshake className="w-7 h-7 text-primary mb-3" />
                <p className="text-sm font-medium text-foreground/90">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTORS */}
      <section className="py-16 sm:py-24 px-4 bg-secondary text-secondary-foreground">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4">
              <Handshake className="w-3.5 h-3.5" /> Investors & Partners
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Building The Future Of Urban Logistics In Africa</h2>
            <p className="text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
              ChopTym is building affordable, technology-enabled logistics infrastructure designed specifically for African cities. We welcome conversations with:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Angel Investors", "Venture Capital Firms", "Impact Investors", "Strategic Partners", "Corporate Collaborators"].map((t) => (
                <span key={t} className="px-4 py-2 rounded-full text-sm bg-secondary-foreground/10 border border-secondary-foreground/15">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`mailto:${EMAIL}?subject=Partnership%20with%20ChopTym`}>
                <Button size="lg" className="rounded-full px-7 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Handshake className="w-5 h-5" /> Partner With Us
                </Button>
              </a>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-primary">
                <Mail className="w-4 h-4" /> {EMAIL}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECURITY NOTICE */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            {...fadeUp}
            className="relative rounded-3xl border-2 border-amber-500/40 bg-amber-500/5 p-6 sm:p-10"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-none w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">Important Notice</p>
                <h2 className="text-2xl sm:text-3xl font-bold">Security & Fraud Prevention</h2>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed">
              <p>ChopTym operates through <strong>ONE official WhatsApp number only</strong>:</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{WHATSAPP_DISPLAY}</p>
              <p>
                All delivery requests, payments, customer support, and service arrangements must be made exclusively through this official number.
              </p>
              <p>
                Customers who choose to deal directly with riders, drivers, or third parties outside the official ChopTym communication channels do so <strong>entirely at their own risk</strong>.
              </p>
              <p>
                ChopTym will not be responsible for any fraud, losses, disputes, or damages resulting from direct transactions or arrangements made outside our official platform and communication channels.
              </p>
              <p>
                For your protection, always verify that you are communicating with ChopTym through our official WhatsApp number before making payments or sharing sensitive information.
              </p>
            </div>

            <div className="mt-6">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full px-7 gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold">
                  <Shield className="w-5 h-5" /> Verify Official Contact
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 px-4">
        <motion.div
          {...fadeUp}
          className="container mx-auto max-w-4xl text-center rounded-[2rem] bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-10 sm:p-16 shadow-2xl shadow-primary/30"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Need Something Delivered, Purchased, Processed, Collected, or Handled?
          </h2>
          <p className="text-primary-foreground/85 max-w-2xl mx-auto mb-8">
            From food delivery and shopping assistance to government office errands, trusted payments, and business logistics — ChopTym helps move what matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <WhatsAppBtn label="Order on WhatsApp" />
            <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-7 gap-2 border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Mail className="w-5 h-5" /> Contact Us
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png" alt="ChopTym" className="w-9 h-9" />
              <div>
                <p className="font-bold text-primary">ChopTym</p>
                <p className="text-xs text-muted-foreground italic">Chill, we dey bringam.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <Link to="/how-it-works" className="hover:text-foreground">How It Works</Link>
              <Link to="/blog" className="hover:text-foreground">Blog</Link>
              <Link to="/resources" className="hover:text-foreground">Resources</Link>
              <a href="tel:+237670416449" className="hover:text-foreground inline-flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> {WHATSAPP_DISPLAY}
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-foreground inline-flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground space-y-1">
            <p>Serving Limbe, Cameroon and expanding to new communities.</p>
            <p>© {new Date().getFullYear()} ChopTym. All rights reserved.</p>
          </div>
          <PoweredByBadge />
        </div>
      </footer>
    </div>
  );
}
