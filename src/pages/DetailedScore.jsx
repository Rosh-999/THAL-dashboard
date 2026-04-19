import React, { useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, ReferenceArea, LabelList, Cell
} from 'recharts';
import { Zap, Users, Activity, Award, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { aggregateScores, getQuadrantDetails } from '../utils/calculations';

const DetailedScore = ({ data }) => {
  const stats = useMemo(() => aggregateScores(data), [data]);

  if (!stats) return <div className="p-8 text-center text-text-secondary">Waiting for data...</div>;

  const quadrant = getQuadrantDetails(stats.quadrant);

  // For the scatter plot, we only show one point representing the organization
  const scatterData = [{
    name: stats.quadrant,
    x: stats.techScore,
    y: stats.workforceScore,
  }];

  return (
    <div className="animate-fade-in">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">THAL Detailed Score</h1>
          <p className="text-text-secondary">Deep dive into organization-wide maturity metrics.</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: quadrant.color }}></div>
          <span className="text-sm font-semibold">{stats.quadrant}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quadrant Matrix */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Leadership Matrix (Organization Position)</h2>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }}></div> Leader</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#3b82f6' }}></div> People</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }}></div> Tech</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }}></div> Frag</span>
            </div>
          </div>
          
          <div className="relative border border-white/5 rounded-2xl overflow-hidden bg-slate-900/30" style={{ height: '450px' }}>
            <div className="absolute text-center pointer-events-none z-10" style={{ top: '2rem', right: '4rem' }}>
              <div className="text-xl font-bold text-[#10b981] opacity-60 uppercase tracking-widest">Q1: THAL Leader</div>
              <div className="text-[10px] text-text-secondary">Balanced & Future-Ready</div>
            </div>
            <div className="absolute text-center pointer-events-none z-10" style={{ top: '2rem', left: '4rem' }}>
              <div className="text-xl font-bold text-[#3b82f6] opacity-60 uppercase tracking-widest">Q2: People-Centric</div>
              <div className="text-[10px] text-text-secondary">Strong Leadership, Weak Tech</div>
            </div>
            <div className="absolute text-center pointer-events-none z-10" style={{ bottom: '4rem', right: '4rem' }}>
              <div className="text-xl font-bold text-[#f59e0b] opacity-60 uppercase tracking-widest">Q4: Tech-Driven</div>
              <div className="text-[10px] text-text-secondary">Strong Tech, Weak People</div>
            </div>
            <div className="absolute text-center pointer-events-none z-10" style={{ bottom: '4rem', left: '4rem' }}>
              <div className="text-xl font-bold text-[#ef4444] opacity-60 uppercase tracking-widest">Q3: Fragmented</div>
              <div className="text-[10px] text-text-secondary">Low Both</div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  domain={[0, 100]} 
                  stroke="#64748b"
                  label={{ value: 'Technology Maturity (T+A)', position: 'bottom', offset: 20, fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  domain={[0, 100]} 
                  stroke="#64748b"
                  label={{ value: 'Workforce Maturity (H+L)', angle: -90, position: 'insideLeft', offset: -10, fill: '#64748b', fontSize: 12 }}
                />
                <ZAxis type="number" range={[400, 400]} />
                <ReferenceLine x={70} stroke="#10b981" strokeDasharray="5 5" opacity={0.3} />
                <ReferenceLine x={50} stroke="#ef4444" strokeDasharray="3 3" opacity={0.2} />
                <ReferenceLine y={70} stroke="#10b981" strokeDasharray="5 5" opacity={0.3} />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" opacity={0.2} />
                
                <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#10b981" fillOpacity={0.1} />
                <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#3b82f6" fillOpacity={0.1} />
                <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#ef4444" fillOpacity={0.1} />
                <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#f59e0b" fillOpacity={0.1} />

                <Tooltip 
                   cursor={{ strokeDasharray: '3 3' }}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
                <Scatter name="Organization" data={scatterData} fill={quadrant.color}>
                  <Cell fill={quadrant.color} />
                  <LabelList dataKey="name" position="top" style={{ fill: '#fff', fontSize: '14px', fontWeight: 'bold' }} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Breakdown Cards */}
        <div className="space-y-6">
          <BreakdownCard 
            title="Tech Score" 
            value={stats.techScore} 
            icon={<Zap />} 
            color="#6366f1"
            sub1={{ label: 'Transform', val: stats.transform }}
            sub2={{ label: 'Adapt', val: stats.adapt }}
          />
          <BreakdownCard 
            title="Workforce Score" 
            value={stats.workforceScore} 
            icon={<Users />} 
            color="#ec4899"
            sub1={{ label: 'Humanize', val: stats.humanize }}
            sub2={{ label: 'Lead', val: stats.lead }}
          />
        </div>
      </div>

      {/* Recommendations & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-l-4" style={{ borderColor: quadrant.color }}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Info className="text-primary" />
            Recommendations for {stats.quadrant}
          </h3>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>{quadrant.desc}</p>
            <div className="p-4 bg-glass-bg rounded-xl border border-glass-border mt-4">
              <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                Actionable Advice
              </h4>
              <p className="text-sm">{quadrant.recommendation}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
           <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Section Analysis
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <SectionIndicator label="Transform" value={stats.transform} icon={<Zap size={14}/>} />
              <SectionIndicator label="Adapt" value={stats.adapt} icon={<Activity size={14}/>} />
              <SectionIndicator label="Humanize" value={stats.humanize} icon={<Users size={14}/>} />
              <SectionIndicator label="Lead" value={stats.lead} icon={<Award size={14}/>} />
           </div>
        </div>
      </div>
    </div>
  );
};

const BreakdownCard = ({ title, value, icon, color, sub1, sub2 }) => (
  <div className="glass-card p-6 overflow-hidden relative">
    <div className="flex items-center gap-4 mb-6">
       <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: color }}>
         {React.cloneElement(icon, { size: 20 })}
       </div>
       <div>
         <div className="text-xs uppercase tracking-widest text-text-secondary font-bold leading-none mb-1">{title}</div>
         <div className="text-2xl font-bold leading-none">{Math.round(value)}%</div>
       </div>
    </div>
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-glass-border">
       <div>
         <div className="text-[10px] text-text-secondary uppercase mb-1">{sub1.label}</div>
         <div className="font-mono text-sm font-bold">{Math.round(sub1.val)}%</div>
       </div>
       <div>
         <div className="text-[10px] text-text-secondary uppercase mb-1">{sub2.label}</div>
         <div className="font-mono text-sm font-bold">{Math.round(sub2.val)}%</div>
       </div>
    </div>
    {/* Background accent */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-10 -translate-y-10 rounded-full" style={{ background: color }}></div>
  </div>
);

const SectionIndicator = ({ label, value, icon }) => (
  <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
    <div className="flex items-center gap-2 text-text-secondary mb-2">
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </div>
    <div className="text-lg font-bold">{Math.round(value)}%</div>
    <div className="w-full h-1 bg-white/5 rounded-full mt-2">
       <div className="h-full bg-primary rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default DetailedScore;
