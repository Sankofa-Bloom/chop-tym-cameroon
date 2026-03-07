import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  UtensilsCrossed,
  Calendar,
  Clock,
  ArrowLeft,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { getBlogPost, getRecentPosts } from "@/data/blogPosts";
import { Card, CardContent } from "@/components/ui/card";

const WHATSAPP_NUMBER = "+237670416449";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=Hi%20Choptym%2C%20I%20have%20a%20task%20for%20you`;

const categoryColors: Record<string, string> = {
  "Company News": "bg-primary/10 text-primary border-primary/20",
  Insights: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Guides: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Services: "bg-green-500/10 text-green-500 border-green-500/20",
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const recentPosts = getRecentPosts(3).filter((p) => p.slug !== post.slug);

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content
      .trim()
      .split("\n\n")
      .map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl font-bold font-heading mt-8 mb-3 text-foreground"
            >
              {trimmed.replace("## ", "")}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-lg font-semibold mt-6 mb-2 text-foreground"
            >
              {trimmed.replace("### ", "")}
            </h3>
          );
        }

        // List items
        if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
          const items = trimmed.split("\n").filter((l) => l.trim());
          return (
            <ul key={i} className="space-y-2 my-4">
              {items.map((item, j) => {
                const text = item.replace(/^[-\d.]\s*/, "").trim();
                // Handle bold markdown
                const parts = text.split(/\*\*(.*?)\*\*/g);
                return (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-muted-foreground leading-relaxed"
                  >
                    <span className="text-primary mt-1.5 text-xs">●</span>
                    <span>
                      {parts.map((part, k) =>
                        k % 2 === 1 ? (
                          <strong key={k} className="text-foreground font-medium">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Italic block (testimonial)
        if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-primary/30 pl-4 my-4 italic text-muted-foreground"
            >
              {trimmed.replace(/^\*|\*$/g, "")}
            </blockquote>
          );
        }

        // Regular paragraph with bold support
        const parts = trimmed.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-muted-foreground leading-relaxed my-4">
            {parts.map((part, k) =>
              k % 2 === 1 ? (
                <strong key={k} className="text-foreground font-medium">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      });
  };

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
                to="/blog"
                className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
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

      {/* Article */}
      <article className="py-12 sm:py-16">
        <motion.div
          className="container mx-auto px-4 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className={categoryColors[post.category] || "bg-muted"}
            >
              {post.category}
            </Badge>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading leading-tight mb-4">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-10 pb-6 border-b border-border/50">
            <User className="w-4 h-4" aria-hidden="true" />
            <span>{post.author}</span>
          </div>

          {/* Content */}
          <div className="prose-custom">{renderContent(post.content)}</div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  Need a delivery or errand done?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Message ChopTym on WhatsApp and we'll handle it for you.
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Message Us on WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Related Posts */}
          {recentPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold font-heading mb-6">
                More from ChopTym
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {recentPosts.slice(0, 2).map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="group"
                  >
                    <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-all">
                      <CardContent className="p-5">
                        <Badge
                          variant="outline"
                          className={`${
                            categoryColors[related.category] || "bg-muted"
                          } mb-2`}
                        >
                          {related.category}
                        </Badge>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">
                          {related.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(related.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </article>

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
                to="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/order"
                className="hover:text-foreground transition-colors"
              >
                Order Food
              </Link>
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
