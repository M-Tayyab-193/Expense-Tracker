import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  Users, 
  BarChart3, 
  Bell, 
  Shield, 
  Smartphone 
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
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay on top of your finances with intelligent alerts for bill reminders, spending limits, and payment requests.",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your financial data is protected with enterprise-grade encryption and security measures you can trust.",
    gradient: "from-gray-600 to-gray-800"
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Sync",
    description: "Access your expenses anywhere, anytime. Seamless synchronization across all your devices in real-time.",
    gradient: "from-pink-500 to-rose-600"
  }
];

const FeatureCards = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Smart Finance</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to take control of your financial life, beautifully designed and intelligently crafted.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm group h-full">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;