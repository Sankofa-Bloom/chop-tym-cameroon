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
  Star,
  HeartHandshake,
  AlertCircle,
  UtensilsCrossed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const WHATSAPP_NUMBER = "+237670416449";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=Hi%20Choptym%2C%20I%20have%20a%20task%20for%20you`;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png" 
                alt="Choptym"
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold font-heading text-primary">Choptym</h1>
                <p className="text-xs text-muted-foreground">Your delivery partner in Limbe</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/order">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4" />
                  Order Food
                </Button>
              </Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <motion.div 
          className="container mx-auto px-4 max-w-4xl text-center relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading leading-tight mb-6 text-foreground"
            variants={fadeInUp}
          >
            Get it done properly —{" "}
            <span className="text-primary">without delays, excuses, or uncertainty.</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            From pickups and deliveries to personal errands, Choptym handles the task, 
            keeps you informed, and makes sure nothing falls through the cracks.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            variants={fadeInUp}
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-6 gap-3 shadow-lg hover:shadow-xl transition-all">
                <MessageCircle className="w-5 h-5" />
                Send your task on WhatsApp
              </Button>
            </a>
            <Link to="/order" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 gap-3">
                <UtensilsCrossed className="w-5 h-5" />
                Order Food Online
              </Button>
            </Link>
          </motion.div>

          <motion.p 
            className="text-sm text-muted-foreground mb-8"
            variants={fadeInUp}
          >
            <span className="font-medium text-foreground">Starting from 1,000 FCFA</span> · Price varies by task
          </motion.p>

          {/* Social Proof */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10"
            variants={fadeInUp}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              2+ years in operation
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              250+ customers
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-primary" />
              10+ businesses in Limbe
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Trusted by clients outside Limbe
            </span>
          </motion.div>

          {/* Process Snapshot */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 inline-block"
            variants={fadeInUp}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MessageCircle className="w-4 h-4 text-primary" />
                Send task
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                Assigned
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="w-4 h-4 text-primary" />
                Picked up
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Truck className="w-4 h-4 text-primary" />
                Delivered
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Confirmed
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-4">What we handle for you</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether it's across town or a quick pickup, we take care of it so you don't have to stress.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Deliveries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Pickups & Deliveries</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Same-day delivery within Limbe. We pick up from any location and deliver to your destination.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Food orders from restaurants
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Market shopping
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Package collection
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Errands */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Personal Errands</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Need something done but can't leave? We run errands on your behalf with regular updates.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Bill payments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Queue waiting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Prescription pickups
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Document Handling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Document Handling</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Sensitive documents delivered with care. We understand the importance of your paperwork.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Contract delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Office documents
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Official submissions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-4">Why customers trust Choptym</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Reliability isn't a feature — it's our foundation.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Accountability",
                description: "Every task is tracked. You always know what's happening."
              },
              {
                icon: Phone,
                title: "Responsive",
                description: "Quick replies. No ghosting. We're always reachable."
              },
              {
                icon: Clock,
                title: "Punctual",
                description: "We respect your time and stick to agreed timelines."
              },
              {
                icon: HeartHandshake,
                title: "Professional",
                description: "Courteous riders. Careful handling. No drama."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-4">What our customers say</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "They delivered my documents across Limbe in under an hour. I was impressed by the updates I got throughout.",
                author: "Grace N.",
                role: "Business Owner"
              },
              {
                quote: "I use Choptym for market runs when I'm busy at work. They always get exactly what I ask for.",
                author: "Emmanuel T.",
                role: "Bank Employee"
              },
              {
                quote: "Very reliable. I've never had a package go missing or arrive late. They're my go-to delivery partner.",
                author: "Divine M.",
                role: "Shop Owner"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-medium text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expectations Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-4">What to expect</h3>
            <p className="text-muted-foreground">
              Transparency matters. Here's what we control — and what we don't.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-green-500/30 bg-green-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h4 className="font-semibold text-lg">What Choptym controls</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Fast response to your requests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Regular status updates throughout the task</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Careful handling of your items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Delivery confirmation with proof</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Professional and courteous service</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-muted-foreground/30 bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-muted-foreground" />
                    <h4 className="font-semibold text-lg">What's outside our control</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Unexpected road closures or traffic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Third-party delays (banks, offices, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Availability of specific items at vendors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Weather conditions affecting travel</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                    We'll always communicate proactively if any of these affect your task.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-transparent">
        <motion.div 
          className="container mx-auto px-4 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-4">
            Ready to get your task done?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Tell us what you need on WhatsApp. We'll respond quickly with a price and timeline.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-6 gap-3 shadow-lg hover:shadow-xl transition-all">
                <MessageCircle className="w-5 h-5" />
                Send your task on WhatsApp
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
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
                alt="Choptym"
                className="w-8 h-8"
              />
              <div>
                <p className="font-semibold text-primary">Choptym</p>
                <p className="text-xs text-muted-foreground">Your trusted delivery partner in Limbe</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="tel:+237670416449" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                +237 670 416 449
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Choptym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
