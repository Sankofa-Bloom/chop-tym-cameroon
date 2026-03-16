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
  UtensilsCrossed,
  Bike,
  Box,
  Navigation,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/choptym-delivery-hero.jpg";
import { PoweredByBadge } from "@/components/PoweredByBadge";

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

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm" role="banner">
        <nav className="container mx-auto px-4 py-4 max-w-6xl" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3" aria-label="ChopTym Delivery Company - Home">
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
            </a>
            
            <div className="flex items-center gap-3">
              <Link to="/how-it-works" className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="/blog" className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
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
                aria-label="Contact ChopTym on WhatsApp for delivery and errand services"
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

      {/* Hero Section - Delivery Service in Limbe, Cameroon */}
      <section className="relative py-12 sm:py-20 overflow-hidden" aria-labelledby="hero-heading">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="ChopTym delivery rider on motorcycle delivering packages in Limbe, Cameroon"
            className="w-full h-full object-cover opacity-20"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        {/* Animated Floating Delivery Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-16 left-[10%] hidden lg:block"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-32 right-[12%] hidden lg:block"
            animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Package className="w-7 h-7 text-primary" />
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-32 left-[15%] hidden lg:block"
            animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bike className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-24 right-[18%] hidden lg:block"
            animate={{ y: [0, -14, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Box className="w-7 h-7 text-primary" />
            </div>
          </motion.div>

          <motion.div 
            className="absolute top-48 left-[5%] hidden xl:block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary/70" />
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="container mx-auto px-4 max-w-4xl text-center relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Company Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
            variants={fadeInUp}
          >
            <Truck className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary">ChopTym Delivery Company</span>
            <span className="text-xs text-muted-foreground">• Limbe, Cameroon</span>
          </motion.div>

          <motion.h1 
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading leading-tight mb-6 text-foreground"
            variants={fadeInUp}
          >
            Reliable Delivery Service in Limbe —{" "}
            <span className="text-primary">No delays, no excuses, no uncertainty.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            From pickups and deliveries to personal errands across Cameroon, <span className="text-foreground font-medium">ChopTym</span> handles the task, 
            keeps you informed via WhatsApp, and makes sure nothing falls through the cracks. Your trusted errand service in Limbe.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            variants={fadeInUp}
          >
            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto"
              aria-label="Send your delivery or errand task on WhatsApp"
            >
              <Button size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg px-8 py-6 gap-3 shadow-lg hover:shadow-xl transition-all">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                Send your task on WhatsApp
              </Button>
            </a>
            <Link to="/order" className="w-full sm:w-auto" aria-label="Order food delivery online in Limbe">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 gap-3">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
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

          {/* Process Snapshot - Enhanced */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 inline-block"
            variants={fadeInUp}
          >
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-medium">How it works</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <motion.span 
                className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-foreground">Send task</span>
              </motion.span>
              <ArrowRight className="w-4 h-4 text-primary hidden sm:block" />
              <motion.span 
                className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-4 h-4 text-primary" />
                <span className="text-foreground">Assigned</span>
              </motion.span>
              <ArrowRight className="w-4 h-4 text-primary hidden sm:block" />
              <motion.span 
                className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Package className="w-4 h-4 text-primary" />
                <span className="text-foreground">Picked up</span>
              </motion.span>
              <ArrowRight className="w-4 h-4 text-primary hidden sm:block" />
              <motion.span 
                className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-foreground">Delivered</span>
              </motion.span>
              <ArrowRight className="w-4 h-4 text-primary hidden sm:block" />
              <motion.span 
                className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-foreground font-medium">Confirmed</span>
              </motion.span>
            </div>
          </motion.div>

          {/* Delivery Visual Illustration */}
          <motion.div 
            className="mt-12 flex items-center justify-center gap-4"
            variants={fadeInUp}
          >
            <motion.div 
              className="flex items-center gap-2 text-muted-foreground"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs hidden sm:block">Pickup</span>
            </motion.div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/40"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            
            <motion.div 
              className="relative"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Bike className="w-7 h-7 text-primary-foreground" />
              </div>
              <motion.div 
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Zap className="w-2.5 h-2.5 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/40"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + 0.5 }}
                />
              ))}
            </div>
            
            <motion.div 
              className="flex items-center gap-2 text-muted-foreground"
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-xs hidden sm:block">Delivery</span>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section - Delivery and Errand Services in Limbe */}
      <section className="py-16 bg-card/50" aria-labelledby="services-heading">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="services-heading" className="text-2xl sm:text-3xl font-bold font-heading mb-4">
              Delivery & Errand Services in Limbe
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether it's across Limbe or a quick pickup in Cameroon, we take care of it so you don't have to stress.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6" role="list">
            {/* Deliveries */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              role="listitem"
            >
              <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Truck className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Same-Day Delivery in Limbe</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Fast and reliable courier service within Limbe, Cameroon. We pick up from any location and deliver to your destination the same day.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5" aria-label="Delivery service features">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Food delivery from restaurants
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Market shopping delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Package collection & delivery
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.article>

            {/* Errands */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              role="listitem"
            >
              <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Personal Errand Service</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Need something done but can't leave? Our errand runners in Limbe handle tasks on your behalf with regular WhatsApp updates.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5" aria-label="Errand service features">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Bill payments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Queue waiting service
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Prescription pickups
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.article>

            {/* Document Handling */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              role="listitem"
            >
              <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Document Courier Service</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Secure document handling and delivery across Limbe and Cameroon. We understand the importance of your paperwork.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5" aria-label="Document service features">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Contract delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Office documents
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                      Official submissions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Trust Section - Why Choose ChopTym */}
      <section className="py-16" aria-labelledby="trust-heading">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="trust-heading" className="text-2xl sm:text-3xl font-bold font-heading mb-4">
              Why Choose ChopTym for Delivery in Cameroon
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trusted by 250+ customers and 10+ businesses in Limbe. Reliability isn't a feature — it's our foundation.
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

      {/* Testimonials - Customer Reviews */}
      <section className="py-16 bg-card/50" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="testimonials-heading" className="text-2xl sm:text-3xl font-bold font-heading mb-4">
              Customer Reviews from Limbe
            </h2>
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
                    <h4 className="font-semibold text-lg">What ChopTym controls</h4>
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
                alt="ChopTym Delivery Company"
                className="w-8 h-8"
              />
              <div>
                <p className="font-semibold text-primary">ChopTym Delivery Company</p>
                <p className="text-xs text-muted-foreground">Your trusted delivery partner in Limbe</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/how-it-works" className="hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/resources" className="hover:text-foreground transition-colors">
                Resources
              </Link>
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
            <p>© {new Date().getFullYear()} ChopTym Delivery Company. All rights reserved.</p>
          </div>
          <PoweredByBadge />
        </div>
      </footer>
    </div>
  );
}
