import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { InlineDivisionSwitcher } from "./InlineDivisionSwitcher";
import { DashboardStats } from "./DashboardStats";
import { DealPipelinePreview } from "./DealPipelinePreview";
import { DashboardTasks } from "./DashboardTasks";

export const CRMCommandCenter = () => {
  return (
    <div className="glass-card p-5 md:p-6 space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">CRM Command Center</h2>
            <p className="text-xs text-muted-foreground">Manage your pipeline across divisions</p>
          </div>
        </div>
        <Link
          to="/portal/crm"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>Full CRM</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Division Switcher - Compact */}
      <div className="pt-1">
        <InlineDivisionSwitcher compact />
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <DashboardStats />
      </motion.div>

      {/* Pipeline & Tasks Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <DealPipelinePreview />
        <DashboardTasks />
      </motion.div>
    </div>
  );
};
