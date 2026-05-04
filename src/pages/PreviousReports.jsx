import React from 'react';
import { History, TrendingUp, Users, ArrowUpRight } from 'lucide-react';


const PreviousReports = ({ currentData }) => {
  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold gradient-text mb-2">Previous Reports View</h1>
        <p className="text-text-secondary">Track your organizational maturity progress over time.</p>
      </header>

      <div className="space-y-6">
        {/* Current (Live) Summary */}
        <div className="glass-card border-l-4 border-primary">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl primary-gradient flex items-center justify-center text-white">
                 <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl">Current Assessment (Live)</h3>
                <p className="text-xs text-text-secondary uppercase font-bold">April 2026</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-bold text-sm">
               ACTIVE
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <ReportStat label="Participation" val={currentData.length} icon={<Users size={16}/>} />
             <ReportStat label="Avg Tech" val="72%" icon={<ArrowUpRight size={16} className="text-emerald-500" />} />
             <ReportStat label="Avg Workforce" val="70%" icon={<ArrowUpRight size={16} className="text-emerald-500" />} />
          </div>
        </div>

        {/* Previous Reports List */}
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <History size={20} className="text-text-secondary" />
            Historical Archive
          </h3>
          <div className="glass-card flex flex-col items-center justify-center py-16 text-center mt-2">
            <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
              <History size={32} className="text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-700 mb-2">No Previous History Available</h4>
            <p className="text-sm text-slate-500 max-w-md">
              There are currently no historical archives or previous reports available for comparison. Future assessments will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportStat = ({ label, val, icon }) => (
  <div className="p-4 bg-glass-bg rounded-xl border border-glass-border">
    <div className="text-[10px] text-text-secondary uppercase font-bold mb-1 flex items-center gap-2">
      {icon} {label}
    </div>
    <div className="text-2xl font-bold">{val}</div>
  </div>
);

export default PreviousReports;
