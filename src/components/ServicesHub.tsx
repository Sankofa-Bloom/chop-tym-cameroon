import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Package, Truck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ServiceType = "errands" | "package-delivery" | "pickups-dropoffs" | "custom-request";

interface ServicesHubProps {
  onBack: () => void;
  onSelectService: (serviceType: ServiceType) => void;
  selectedTown: string;
}

const services = [
  {
    id: "errands" as ServiceType,
    title: "Errands",
    description: "Need something bought? We'll handle it for you",
    icon: ShoppingBag,
    examples: ["Buy groceries", "Pharmacy items", "Documents"],
    color: "bg-orange-500",
  },
  {
    id: "package-delivery" as ServiceType,
    title: "Package Delivery",
    description: "Send items from one place to another",
    icon: Package,
    examples: ["Send documents", "Gifts", "Packages"],
    color: "bg-blue-500",
  },
  {
    id: "pickups-dropoffs" as ServiceType,
    title: "Pickups & Drop-offs",
    description: "We'll pick up and deliver for you",
    icon: Truck,
    examples: ["Pick up orders", "Collect items", "Returns"],
    color: "bg-green-500",
  },
  {
    id: "custom-request" as ServiceType,
    title: "Custom Request",
    description: "Tell us what you need done",
    icon: MessageSquare,
    examples: ["Special requests", "Unique tasks", "Anything else"],
    color: "bg-purple-500",
  },
];

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const ServicesHub = ({ onBack, onSelectService, selectedTown }: ServicesHubProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold font-heading">ChopTym Services</h1>
              <p className="text-sm text-muted-foreground">Delivering in {selectedTown}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Truck className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">More Than Just Food</h2>
              <p className="text-white/90">
                From errands to deliveries, we've got you covered. Select a service below to get started.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.id} variants={cardVariants}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 border-transparent hover:border-primary/20"
                  onClick={() => onSelectService(service.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${service.color} p-3 rounded-xl text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {service.examples.map((example, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">How It Works:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Select the service you need</li>
                <li>• Fill in the request details</li>
                <li>• We'll contact you to confirm and give a quote</li>
                <li>• Pay on delivery for your peace of mind</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
