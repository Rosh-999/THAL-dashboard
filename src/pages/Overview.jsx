import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, Briefcase, ChevronRight, TrendingUp } from 'lucide-react';
import { aggregateScores, getQuadrantDetails } from '../utils/calculations';

const Overview = ({ data }) => {
  const navigate = useNavigate();

  const orgStats = useMemo(() => aggregateScores(data), [data]);
  
  const departmentStats = useMemo(() => {
    const groups = data.reduce((acc, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [data]);

  const COLORS = ['#4338ca', '#7e22ce', '#be185d', '#b45309', '#047857', '#1d4ed8'];

  if (!orgStats) return <div className="p-8">No data available...</div>;

  const quadrant = getQuadrantDetails(orgStats.quadrant);

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Overview</h1>
        <p className="text-text-secondary">Summary of organizational THAL maturity and participation.</p>
      </header>

      <div className="glass-card mb-8 flex flex-col xl:flex-row gap-8">
        {/* Left Side: Overall Score & Quadrant */}
        <div className="flex flex-col md:flex-row items-center gap-8 xl:w-2/5 xl:border-r border-glass-border xl:pr-8">
          <div className="relative w-48 h-48 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: quadrant.bg }}>
             <div className="text-center">
               <div className="text-4xl font-bold" style={{ color: quadrant.color }}>
                 {Math.round((orgStats.techScore + orgStats.workforceScore) / 2)}%
               </div>
               <div className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">Overall Score</div>
             </div>
             {/* Simple SVG ring */}
             <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="96" cy="96" r="88" fill="transparent" stroke={quadrant.color} strokeWidth="8" strokeDasharray={552} strokeDashoffset={552 - (552 * ((orgStats.techScore + orgStats.workforceScore) / 2)) / 100} strokeLinecap="round" />
             </svg>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
               <div className="w-3 h-3 rounded-full" style={{ background: quadrant.color }}></div>
               {orgStats.quadrant}
            </h2>
            <p className="text-text-secondary mb-4 leading-relaxed text-sm">
              {quadrant.desc}
            </p>
            <button 
              onClick={() => navigate('/detailed-score')}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl primary-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View Detailed Report <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Unified Key Metrics Grid */}
        <div className="xl:w-3/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
           {/* Metric: Attendees */}
           <div className="flex flex-col">
             <div className="flex items-center gap-2 text-text-secondary mb-1">
               <Users size={16} />
               <span className="text-[10px] uppercase font-bold tracking-widest">Responses</span>
             </div>
             <div className="text-2xl font-bold">{orgStats.attendees}</div>
           </div>

           {/* Metric: Departments */}
           <div className="flex flex-col">
             <div className="flex items-center gap-2 text-text-secondary mb-1">
               <Briefcase size={16} />
               <span className="text-[10px] uppercase font-bold tracking-widest">Departments</span>
             </div>
             <div className="text-2xl font-bold">{departmentStats.length}</div>
           </div>

           {/* Metric: Growth */}
           <div className="flex flex-col">
             <div className="flex items-center gap-2 text-text-secondary mb-1">
               <TrendingUp size={16} />
               <span className="text-[10px] uppercase font-bold tracking-widest">Growth</span>
             </div>
             <div className="text-2xl font-bold text-emerald-400">+12%</div>
           </div>

           {/* Metric: Tech Score */}
           <div className="flex flex-col">
             <div className="flex items-center gap-2 text-text-secondary mb-1">
               <span className="text-[10px] uppercase font-bold tracking-widest">Tech Score</span>
             </div>
             <div className="text-2xl font-bold">{Math.round(orgStats.techScore)}%</div>
             <div className={`text-[10px] uppercase font-bold mt-1 ${orgStats.techScore >= 70 ? 'text-[#065f46]' : orgStats.techScore >= 50 ? 'text-[#92400e]' : 'text-[#991b1b]'}`}>
                {orgStats.techScore >= 70 ? 'High maturity' : orgStats.techScore >= 50 ? 'Transition zone' : 'Fragmented'}
             </div>
           </div>

           {/* Metric: People Score */}
           <div className="flex flex-col">
             <div className="flex items-center gap-2 text-text-secondary mb-1">
               <span className="text-[10px] uppercase font-bold tracking-widest">People Score</span>
             </div>
             <div className="text-2xl font-bold">{Math.round(orgStats.workforceScore)}%</div>
             <div className={`text-[10px] uppercase font-bold mt-1 ${orgStats.workforceScore >= 70 ? 'text-[#065f46]' : orgStats.workforceScore >= 50 ? 'text-[#92400e]' : 'text-[#991b1b]'}`}>
                {orgStats.workforceScore >= 70 ? 'High maturity' : orgStats.workforceScore >= 50 ? 'Transition zone' : 'Fragmented'}
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Participation Pie Chart */}
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-6 text-center">Attendee Distribution</h3>
          <div className="w-full flex justify-center items-center" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fcf8f1', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#020617' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* THAL Scores By Dept */}
        <div className="glass-card">
           <h3 className="text-xl font-semibold mb-6">Available Department Scores</h3>
           <div className="space-y-4">
              {Array.from(new Set(data.map(d => d.department))).map((dept, i) => {
                const deptData = data.filter(d => d.department === dept);
                const scores = aggregateScores(deptData);
                const avg = Math.round((scores.techScore + scores.workforceScore) / 2);
                return (
                  <div key={dept} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-glass-bg rounded-xl border border-glass-border gap-3">
                    <div className="font-semibold text-sm truncate max-w-[200px]">{dept}</div>
                    <div className="flex items-center gap-3 flex-1 sm:justify-end">
                      <div className="flex-1 sm:flex-none sm:w-32 h-2 bg-black/5 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${avg}%`, background: getQuadrantDetails(scores.quadrant).color }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold w-10 text-right text-sm">{avg}%</span>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
