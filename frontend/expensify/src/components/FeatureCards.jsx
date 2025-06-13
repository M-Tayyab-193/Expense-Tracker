import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  Users, 
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: "Personal Expense Tracking",
    description: "Effortlessly track your daily expenses with smart categorization and instant insights into your spending patterns.",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    icon: Users,
    title: "Group Expense Splitting",
    description: "Split bills with friends and family seamlessly. No more awkward money conversations or forgotten debts.",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Visualize your financial data with beautiful charts and get actionable insights to improve your financial health.",
    gradient: "from-purple-500 to-indigo-600"
  }
];

const FeatureCards = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className={`absolute inset-0 bg-[url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E\")] opacity-30`}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Core Features for
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent block mt-2">
              Financial Freedom
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Three powerful tools designed to transform how you manage your finances, 
            from personal tracking to collaborative expense management.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              className="group"
            >
              <Card className="bg-slate-800/60 border-slate-700/50 hover:border-purple-500/30 transition-all duration-500 backdrop-blur-lg group h-full relative overflow-hidden">
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <motion.div
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.6 }
                    }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mb-3">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-300 text-center leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ 
                    background: 'linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, #8b5cf6, #ec4899, #ef4444)',
                    backgroundClip: 'padding-box, border-box',
                    backgroundOrigin: 'padding-box, border-box'
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to action section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.p 
            className="text-lg text-gray-400 mb-8"
            whileInView={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready to transform your financial management?
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10">Start Your Journey</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;