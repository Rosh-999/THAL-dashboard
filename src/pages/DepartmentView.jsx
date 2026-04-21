import React, { useMemo, useState } from 'react';
import { Briefcase, TrendingUp, Info, X, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { aggregateScores, getQuadrantDetails } from '../utils/calculations';

const DepartmentView = ({ data }) => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [modalOrigin, setModalOrigin] = useState(null);

  const handleDeptClick = (e, dept) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setSelectedDept(dept);
  };

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
    <>
      {/* Drill-down Modal - Rendered outside the animated container for fixed positioning */}
      {selectedDept && (
        <div 
          className="modal-overlay" 
          style={{ 
            display: 'flex', 
            visibility: 'visible', 
            opacity: 1,
            zIndex: 9999 
          }}
          onClick={() => {
            setSelectedDept(null);
            setModalOrigin(null);
          }}
        >
          <div 
            className="glass-card shadow-2xl" 
            style={{ 
              maxWidth: '800px', 
              width: '90%', 
              padding: '0', 
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              transformOrigin: modalOrigin ? `${modalOrigin.x}px ${modalOrigin.y}px` : 'center',
              animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl primary-gradient flex items-center justify-center text-white">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedDept.name.toUpperCase()} ANALYSIS</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getQuadrantDetails(selectedDept.quadrant).color }}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      {selectedDept.quadrant} • {selectedDept.attendees} Respondents
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedDept(null);
                  setModalOrigin(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg text-text-secondary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-text-secondary mb-2 flex items-center gap-2">
                      <Search size={12} /> Situation
                    </h4>
                    <p className="text-sm text-text-primary leading-relaxed bg-white/5 p-3 rounded-lg">
                      {getQuadrantDetails(selectedDept.quadrant).situation}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-text-secondary mb-2 flex items-center gap-2">
                      <TrendingUp size={12} /> Focus
                    </h4>
                    <p className="text-sm text-text-primary leading-relaxed bg-white/5 p-3 rounded-lg">
                      {getQuadrantDetails(selectedDept.quadrant).focus}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <h4 className="text-xs font-bold mb-3">Scores</h4>
                    <MetricBar label="Tech" value={selectedDept.techScore} color="#6366f1" />
                    <div className="h-4"></div>
                    <MetricBar label="Workforce" value={selectedDept.workforceScore} color="#ec4899" />
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="text-xs font-bold mb-3 flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> Roadmap
                    </h4>
                    <ul className="space-y-2">
                      {getQuadrantDetails(selectedDept.quadrant).todo.map((item, idx) => (
                        <li key={idx} className="text-xs text-text-secondary flex gap-2">
                          <span className="text-emerald-500 font-bold">{idx + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-900/50 border-t border-white/5 text-center">
               <p className="italic text-primary text-sm font-medium">
                 "{getQuadrantDetails(selectedDept.quadrant).oneLiner}"
               </p>
            </div>
          </div>
        </div>
      )}

      <div className="animate-fade-in">
        <header className="mb-10">
          <h1 className="text-3xl font-bold gradient-text mb-2">Detailed Department Scores</h1>
          <p className="text-text-secondary">Comparing maturity levels across organizational units.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departmentData.map((dept) => {
          const details = getQuadrantDetails(dept.quadrant);
          return (
            <div 
              key={dept.name} 
              className="glass-card flex flex-col h-full hover:translate-y-[-4px] transition-all cursor-pointer group"
              onClick={(e) => handleDeptClick(e, dept)}
            >
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
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

              <div className="pt-4 border-t border-glass-border flex items-center justify-between">
                <div className="flex items-start gap-3 text-sm text-text-secondary">
                  <Info size={16} className="mt-0.5 flex-shrink-0" style={{ color: details.color }} />
                  <p className="italic leading-snug line-clamp-2">
                    {details.recommendation}
                  </p>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <TrendingUp size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
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
