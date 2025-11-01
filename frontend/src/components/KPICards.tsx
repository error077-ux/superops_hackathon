import { Card } from './ui/card';
import { TrendingUp, Target, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: number;
}

function KPICard({ title, value, subtitle, icon, gradient, trend }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${gradient} p-6 backdrop-blur-sm`}>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              {icon}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs text-white/90">
                <TrendingUp className="w-3 h-3" />
                <span>+{trend}%</span>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm text-white/80 mb-1">{title}</p>
            <h3 className="text-white mb-1">{value}</h3>
            <p className="text-xs text-white/70">{subtitle}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface KPICardsProps {
  totalRules: number;
  uniqueObligations: number;
  complianceAccuracy: number;
  avgProcessingTime: number;
}

export function KPICards({ totalRules, uniqueObligations, complianceAccuracy, avgProcessingTime }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Rules Applied"
        value={totalRules}
        subtitle="Across all frameworks"
        icon={<CheckCircle className="w-6 h-6 text-white" />}
        gradient="from-blue-600 to-blue-700"
        trend={12}
      />
      
      <KPICard
        title="Unique Obligations"
        value={uniqueObligations}
        subtitle="Identified and tracked"
        icon={<Target className="w-6 h-6 text-white" />}
        gradient="from-teal-600 to-teal-700"
        trend={8}
      />
      
      <KPICard
        title="Compliance Accuracy"
        value={`${complianceAccuracy}%`}
        subtitle="AI confidence score"
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        gradient="from-purple-600 to-purple-700"
        trend={5}
      />
      
      <KPICard
        title="Avg Processing Time"
        value={`${avgProcessingTime}s`}
        subtitle="Per compliance check"
        icon={<Clock className="w-6 h-6 text-white" />}
        gradient="from-green-600 to-green-700"
      />
    </div>
  );
}
