import React from 'react';
import { History, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const DUMMY_REPORTS = [
  { id: '1', date: 'Jan 2026', attendees: 145, tech: 62, workforce: 58, quadrant: 'Transition Zone', growth: '+5%' },
  { id: '2', date: 'Oct 2025', attendees: 120, tech: 48, workforce: 45, quadrant: 'Fragmented', growth: '+12%' },
];

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
          {DUMMY_REPORTS.map((report) => (
            <div key={report.id} className="glass-card flex flex-col md:flex-row md:items-center justify-between group cursor-pointer hover:border-white/20 transition-all gap-4">
               <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-32 flex-shrink-0">
                    <div className="text-lg font-bold">{report.date}</div>
                    <div className="text-[10px] text-text-secondary uppercase font-bold">{report.attendees} Participated</div>
                  </div>
                  <div className="flex items-center gap-6 md:border-l border-glass-border md:pl-6">
                    <div className="w-16">
                      <div className="text-[10px] text-text-secondary uppercase">Tech</div>
                      <div className="font-mono font-bold">{report.tech}%</div>
                    </div>
                    <div className="w-24">
                      <div className="text-[10px] text-text-secondary uppercase">Workforce</div>
                      <div className="font-mono font-bold">{report.workforce}%</div>
                    </div>
                    <div className="w-32">
                      <div className="text-[10px] text-text-secondary uppercase">Quadrant</div>
                      <div className="font-bold text-sm">{report.quadrant}</div>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-glass-border pt-4 md:pt-0">
                 <div className="text-emerald-500 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">{report.growth}</div>
                 <button className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all flex-shrink-0">
                   <ArrowUpRight size={18} />
                 </button>
               </div>
            </div>
          ))}
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
