import { Link } from "react-router-dom";
import { MessageCircle, ExternalLink } from "lucide-react";
import { PoweredByBadge } from "@/components/PoweredByBadge";

const WHATSAPP_LINK = "https://wa.me/237670416449";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="py-6 border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png"
              alt="ChopTym Delivery Company"
              className="w-8 h-8"
            />
            <span className="font-semibold text-primary">ChopTym</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Resources</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Useful tools, directories, and resources we recommend for entrepreneurs, startups, and partners.
          </p>
        </div>
      </section>

      {/* Startup & Investor Resources */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-xl border border-border bg-card p-8 md:p-10">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
              Startup, Tech & Investor Resources
            </h2>
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-muted-foreground leading-relaxed">
                <a
                  href="https://www.investorlist.com/"
                  target="_blank"
                  rel="noopener"
                  className="text-primary font-medium hover:underline"
                >
                  Investorlist.com
                </a>
                {" – downloadable, curated lists of active startup investors, angels, VCs, and family offices."}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-muted-foreground leading-relaxed">
                <a
                  href="https://www.sankofabloom.com/"
                  target="_blank"
                  rel="noopener"
                  className="text-primary font-medium hover:underline"
                >
                  SankofaBloom.com
                </a>
                {" – turning African ingenuity into digital ecosystems that thrive globally. Technology studio building solutions rooted in culture for African markets."}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-muted-foreground leading-relaxed">
                <a
                  href="https://diginumsms.com/"
                  target="_blank"
                  rel="noopener"
                  className="text-primary font-medium hover:underline"
                >
                  DigiNum.com
                </a>
                {" – instant access to virtual phone numbers for SMS verification. Simple, secure, and affordable — no SIM card required, with coverage in 50+ countries."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png"
                alt="ChopTym Delivery Company"
                className="w-8 h-8"
              />
              <div>
                <p className="font-semibold text-primary">ChopTym Delivery Company</p>
                <p className="text-xs text-muted-foreground">Your trusted delivery partner in Limbe</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/order" className="hover:text-foreground transition-colors">Order Food</Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} ChopTym Delivery Company. All rights reserved.</p>
          </div>
          <PoweredByBadge />
        </div>
      </footer>
    </div>
  );
};

export default Resources;
