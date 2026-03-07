import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  UtensilsCrossed,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { blogPosts } from "@/data/blogPosts";

const WHATSAPP_NUMBER = "+237670416449";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=Hi%20Choptym%2C%20I%20have%20a%20task%20for%20you`;

const categoryColors: Record<string, string> = {
  "Company News": "bg-primary/10 text-primary border-primary/20",
  Insights: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Guides: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Services: "bg-green-500/10 text-green-500 border-green-500/20",
};

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm"
        role="banner"
      >
        <nav
          className="container mx-auto px-4 py-4 max-w-6xl"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label="ChopTym Delivery Company - Home"
            >
              <img
                src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png"
                alt="ChopTym - Reliable Delivery Service in Limbe, Cameroon"
                className="w-10 h-10"
                width="40"
                height="40"
              />
              <div>
                <span className="text-xl font-bold font-heading text-primary">
                  ChopTym
                </span>
                <p className="text-xs text-muted-foreground">
                  Delivery Company · Limbe
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/how-it-works"
                className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link to="/order" aria-label="Order food delivery in Limbe">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4" aria-hidden="true" />
                  Order Food
                </Button>
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact ChopTym on WhatsApp"
              >
                <Button
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20" aria-labelledby="blog-heading">
        <motion.div
          className="container mx-auto px-4 max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">
              ChopTym Blog
            </span>
          </div>

          <h1
            id="blog-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading leading-tight mb-6"
          >
            News, Guides & Insights from{" "}
            <span className="text-primary">ChopTym Limbe</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stories about delivery in Limbe, tips for sending packages across
            Cameroon, and updates from the ChopTym team.
          </p>
        </motion.div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20" aria-label="Blog articles">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            {sortedPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link to={`/blog/${post.slug}`} className="block h-full group">
                  <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          variant="outline"
                          className={
                            categoryColors[post.category] || "bg-muted"
                          }
                        >
                          {post.category}
                        </Badge>
                      </div>

                      <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            {new Date(post.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            ))}
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
                <p className="font-semibold text-primary">
                  ChopTym Delivery Company
                </p>
                <p className="text-xs text-muted-foreground">
                  Your trusted delivery partner in Limbe
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                to="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/how-it-works"
                className="hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/order"
                className="hover:text-foreground transition-colors"
              >
                Order Food
              </Link>
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
            <p>
              © {new Date().getFullYear()} ChopTym Delivery Company. All rights
              reserved.
            </p>
          </div>
          <PoweredByBadge />
        </div>
      </footer>
    </div>
  );
}
