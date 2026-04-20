import React, { useMemo } from 'react';
import { Briefcase, TrendingUp, Info } from 'lucide-react';
import { aggregateScores, getQuadrantDetails } from '../utils/calculations';

const DepartmentView = ({ data }) => {
  const departmentData = useMemo(() => {
    const departments = Array.from(new Set(data.map(d => d.department)));
    return departments.map(dept => {
      const deptResponses = data.filter(d => d.department === dept);
      const scores = aggregateScores(deptResponses);
      return {
        name: dept,
        ...scores
      };
    });
  }, [data]);

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold gradient-text mb-2">Detailed Department Scores</h1>
        <p className="text-text-secondary">Comparing maturity levels across organizational units.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departmentData.map((dept) => {
          const details = getQuadrantDetails(dept.quadrant);
          return (
            <div key={dept.name} className="glass-card flex flex-col h-full hover:translate-y-[-4px] transition-transform">
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{dept.name}</h3>
                    <p className="text-[10px] text-text-secondary uppercase font-bold mt-1">{dept.attendees} Respondents</p>
                  </div>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center flex-shrink-0"
                  style={{ backgroundColor: details.bg, color: details.color }}
                >
                  {dept.quadrant}
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <MetricBar label="Technology Score" value={dept.techScore} color="#6366f1" />
                <MetricBar label="Workforce Score" value={dept.workforceScore} color="#ec4899" />
              </div>

              <div className="pt-4 border-t border-glass-border">
                <div className="flex items-start gap-3 text-sm text-text-secondary">
                  <Info size={16} className="mt-0.5 flex-shrink-0" style={{ color: details.color }} />
                  <p className="italic leading-snug">
                    {details.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MetricBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-text-secondary font-medium">{label}</span>
      <span className="font-bold font-mono">{Math.round(value)}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${value}%`, background: color }}
      ></div>
    </div>
  </div>
);

export default DepartmentView;
