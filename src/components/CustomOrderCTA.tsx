import { motion } from "framer-motion";
import { Package, ArrowRight, Clock, MapPin, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CustomOrderCTAProps {
  onCustomOrderClick: () => void;
}

export const CustomOrderCTA = ({ onCustomOrderClick }: CustomOrderCTAProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-opacity="0.1"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>')}")`
          }} />
        </div>
        
        <CardContent className="relative z-10 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col lg:flex-row items-center gap-6"
          >
            {/* Icon and Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto lg:mx-0 mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
              >
                <Package className="w-8 h-8" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl sm:text-3xl font-bold font-heading mb-3"
              >
                Need Something Special?
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-white/90 mb-6 text-base sm:text-lg leading-relaxed"
              >
                Can't find what you're looking for? We'll get anything, from anywhere, 
                delivered to your doorstep. Just tell us what you need!
              </motion.p>
              
              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">Available 24/7</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <MapPin className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">Anywhere in Town</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <Smartphone className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">Easy Ordering</span>
                </div>
              </motion.div>
            </div>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="flex-shrink-0"
            >
              <Button 
                size="lg" 
                onClick={onCustomOrderClick}
                className="bg-white text-orange-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold px-8 py-4 text-base rounded-full border-2 border-white/20 group"
              >
                Order Anything
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-6 border-t border-white/20"
          >
            <p className="text-white/70 text-sm text-center lg:text-left">
              <strong className="text-white">Popular requests:</strong> Groceries, documents, 
              pharmacy items, electronics, gifts, food from any restaurant, personal shopping, 
              and much more!
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.section>
  );
};