import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Package,
  Truck,
  CheckCircle2,
  Users,
  Phone,
  Clock,
  Shield,
  MapPin,
  ArrowRight,
  UtensilsCrossed,
  Bike,
  CreditCard,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

const WHATSAPP_NUMBER = "+237670416449";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=Hi%20Choptym%2C%20I%20have%20a%20task%20for%20you`;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.15 },
  },
};

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Send Your Task on WhatsApp",
    description:
      "Message us on WhatsApp with the details of your delivery or errand. Tell us what you need picked up, delivered, or done — and where in Limbe or Cameroon.",
    color: "bg-[#25D366]/10 text-[#25D366]",
    iconBg: "bg-[#25D366]/15",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Get a Price & Confirm",
    description:
      "We respond quickly with a clear price and estimated timeline. No hidden fees. Once you confirm and pay (Mobile Money or Cash), we get to work immediately.",
    color: "bg-primary/10 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    number: "03",
    icon: Bike,
    title: "We Pick Up & Handle It",
    description:
      "A ChopTym rider is assigned to your task. Whether it's a package pickup, food order, document collection, or personal errand — we're on it.",
    color: "bg-primary/10 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    number: "04",
    icon: Truck,
    title: "Live Updates via WhatsApp",
    description:
      "Track your task in real time. We send you WhatsApp updates at every stage — picked up, in transit, and delivered. You're never left guessing.",
    color: "bg-primary/10 text-primary",
    iconBg: "bg-primary/15",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Delivered & Confirmed",
    description:
      "Your delivery is completed and confirmed. We send you proof of delivery and follow up to make sure everything went smoothly.",
    color: "bg-green-500/10 text-green-500",
    iconBg: "bg-green-500/15",
  },
];

const useCases = [
  {
    icon: Package,
    title: "Package & Parcel Delivery",
    description: "Send or receive packages anywhere in Limbe. We also handle inter-city deliveries across Cameroon.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    description: "Order from your favourite restaurants and home cooks in Limbe. We pick up and deliver hot meals to your door.",
  },
  {
    icon: HeartHandshake,
    title: "Personal Errands",
    description: "Bill payments, prescription pickups, queue waiting, market shopping — tell us what you need and we'll handle it.",
  },
  {
    icon: Shield,
    title: "Document Handling",
    description: "Secure pickup and delivery of contracts, official documents, and sensitive paperwork across Limbe.",
  },
];

const faqs = [
  {
    question: "How much does delivery cost in Limbe?",
    answer: "Delivery starts from 1,000 FCFA. The exact price depends on the distance, task complexity, and specific requirements. Message us on WhatsApp for a quick, accurate quote.",
  },
  {
    question: "How fast can you deliver?",
    answer: "Most deliveries within Limbe are completed the same day, often within 1-3 hours. We'll give you a realistic timeline before you confirm.",
  },
  {
    question: "What areas do you cover?",
    answer: "We serve all neighbourhoods in Limbe and handle deliveries from other towns into Limbe. We can also coordinate inter-city deliveries across Cameroon.",
  },
  {
    question: "How do I pay?",
    answer: "We accept Mobile Money (MTN MoMo, Orange Money) and cash. Payment details are shared after you confirm your task on WhatsApp.",
  },
  {
    question: "Is my package safe?",
    answer: "Absolutely. Every delivery is tracked and our riders are vetted professionals. You receive real-time updates and proof of delivery via WhatsApp.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm" role="banner">
        <nav className="container mx-auto px-4 py-4 max-w-6xl" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" aria-label="ChopTym Delivery Company - Home">
              <img
                src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png"
                alt="ChopTym - Reliable Delivery Service in Limbe, Cameroon"
                className="w-10 h-10"
                width="40"
                height="40"
              />
              <div>
                <span className="text-xl font-bold font-heading text-primary">ChopTym</span>
                <p className="text-xs text-muted-foreground">Delivery Company · Limbe</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/order" aria-label="Order food delivery in Limbe">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
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
                <Button size="sm" className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24" aria-labelledby="hiw-heading">
        <motion.div
          className="container mx-auto px-4 max-w-4xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
            variants={fadeInUp}
          >
            <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">Simple. Fast. Reliable.</span>
          </motion.div>

          <motion.h1
            id="hiw-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading leading-tight mb-6"
            variants={fadeInUp}
          >
            How ChopTym Delivery Works in{" "}
            <span className="text-primary">Limbe, Cameroon</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Getting your delivery or errand done is as easy as sending a WhatsApp message. Here's the step-by-step process from start to finish.
          </motion.p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-card/50" aria-labelledby="steps-heading">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h2
            id="steps-heading"
            className="sr-only"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Steps to use ChopTym delivery service
          </motion.h2>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" aria-hidden="true" />

            <div className="space-y-8 md:space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col md:flex-row gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step Number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center border border-border/50`}
                    >
                      <step.icon className={`w-7 h-7 ${step.color.split(" ")[1]}`} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="flex-1 border-border/50 bg-card hover:border-primary/20 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16" aria-labelledby="use-cases-heading">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="use-cases-heading" className="text-2xl sm:text-3xl font-bold font-heading mb-4">
              What Can ChopTym Deliver or Handle?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From food to documents, packages to personal errands — we're your all-in-one delivery and errand service in Limbe.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:border-primary/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-card/50" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold font-heading mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Common questions about ChopTym's delivery service in Limbe.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="border-border/50 bg-card">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel />

      <section className="py-20 bg-gradient-to-b from-primary/10 to-transparent" aria-labelledby="cta-heading">
        <motion.div
          className="container mx-auto px-4 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold font-heading mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Send us your task on WhatsApp and we'll get back to you with a price and timeline in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-6 gap-3 shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                Send Your Task on WhatsApp
              </Button>
            </a>
            <Link to="/order" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 gap-3">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
                Order Food Online
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Or call us at</span>
            <a href="tel:+237670416449" className="text-primary hover:underline font-medium">
              +237 670 416 449
            </a>
          </div>
        </motion.div>
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
              <Link to="/resources" className="hover:text-foreground transition-colors">Resources</Link>
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
}
