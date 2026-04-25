import React, { useMemo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceArea, LabelList, Cell
} from 'recharts';
import { Zap, Users, Activity, Award, Info, AlertTriangle, CheckCircle, Search, TrendingUp } from 'lucide-react';
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
        <div className="lg:col-span-2 glass-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-xl font-semibold">Leadership Matrix</h2>
            <div className="flex flex-wrap gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-text-secondary sm:justify-end">
              <span className="flex items-center gap-1.5 whitespace-nowrap"><div className="w-2 h-2 rounded-full" style={{ background: '#064836ff' }}></div> LEADER</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap"><div className="w-2 h-2 rounded-full" style={{ background: '#1e40af' }}></div> PEOPLE</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap"><div className="w-2 h-2 rounded-full" style={{ background: '#92400e' }}></div> TECH</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap"><div className="w-2 h-2 rounded-full" style={{ background: '#991b1b' }}></div> FRAG</span>
            </div>
          </div>

          <div className="relative border border-white/5 rounded-2xl overflow-hidden bg-slate-900/30 quadrant-matrix">
            <div className="quadrant-label top right">
              <div className="text-[10px] md:text-xl font-bold text-[#065f46] opacity-90 uppercase tracking-widest">
                Q1: THAL LEADER
              </div>
              <div className="hidden md:block text-xs text-text-secondary">Balanced & Future-Ready</div>
            </div>

            <div className="quadrant-label top left">
              <div className="text-[10px] md:text-xl font-bold text-[#1e40af] opacity-90 uppercase tracking-widest">
                Q2: PEOPLE-CENTRIC
              </div>
              <div className="hidden md:block text-xs text-text-secondary">Strong Leadership, Weak Tech</div>
            </div>

            <div className="quadrant-label bottom right">
              <div className="text-[10px] md:text-xl font-bold text-[#92400e] opacity-90 uppercase tracking-widest">
                Q4: TECH-DRIVEN
              </div>
              <div className="hidden md:block text-xs text-text-secondary">Strong Tech, Weak People</div>
            </div>

            <div className="quadrant-label bottom left">
              <div className="text-[10px] md:text-xl font-bold text-[#991b1b] opacity-90 uppercase tracking-widest">
                Q3: FRAGMENTED
              </div>
              <div className="hidden md:block text-xs text-text-secondary">Low Both</div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 40, right: 10, bottom: 40, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 100]}
                  tick={{ fontSize: 9 }}
                  label={{ value: 'Tech Maturity', position: 'bottom', offset: 10, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 100]}
                  tick={{ fontSize: 9 }}
                  width={40}
                  label={{ value: 'Workforce Maturity', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 10 }}
                />
                <ZAxis type="number" range={[400, 400]} />
                <ReferenceLine x={70} stroke="#065f46" strokeDasharray="5 5" opacity={0.3} />
                <ReferenceLine x={50} stroke="#991b1b" strokeDasharray="3 3" opacity={0.2} />
                <ReferenceLine y={70} stroke="#065f46" strokeDasharray="5 5" opacity={0.3} />
                <ReferenceLine y={50} stroke="#991b1b" strokeDasharray="3 3" opacity={0.2} />

                <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#10b981" fillOpacity={0.08} />
                <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#3b82f6" fillOpacity={0.08} />
                <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#ef4444" fillOpacity={0.08} />
                <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#f59e0b" fillOpacity={0.08} />

                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#fcf8f1', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#020617' }}
                />
                <Scatter name="Organization" data={scatterData}>
                  <Cell fill="#fff" stroke={quadrant.color} strokeWidth={4} />
                  <LabelList dataKey="name" position="top" style={{ fill: '#020617', fontSize: '13px', fontWeight: 'bold' }} />
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
        <div className="glass-card border-l-4" style={{ borderColor: quadrant.color }}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Info className="text-primary" />
            Strategic Analysis: {stats.quadrant}
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-2 flex items-center gap-2">
                <Search size={14} /> Current Situation
              </h4>
              <p className="text-text-primary leading-relaxed text-sm">{quadrant.situation}</p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Improvement Focus
              </h4>
              <p className="text-text-primary leading-relaxed text-sm">{quadrant.focus}</p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" /> Risks to Watch
              </h4>
              <p className="text-text-primary leading-relaxed text-sm">{quadrant.risk}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-glass-border">
            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <p className="italic text-primary font-medium text-center text-sm">
                "{quadrant.oneLiner}"
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card border-l-4" style={{ borderColor: quadrant.color }}>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" />
            Actionable Roadmap
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-text-primary mb-3">Recommendation</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{quadrant.recommendation}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-text-primary mb-3">Key Next Steps</h4>
              <ul className="space-y-3 pl-8">
                {quadrant.todo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="font-bold text-emerald-600 flex-shrink-0 w-5 text-right">
                      {idx + 1}.
                    </span>
                    <span className="flex-1 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1" style={{ marginTop: '48px' }}>
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Section Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SectionIndicator label="Transform" value={stats.transform} icon={<Zap size={14} />} />
            <SectionIndicator label="Adapt" value={stats.adapt} icon={<Activity size={14} />} />
            <SectionIndicator label="Humanize" value={stats.humanize} icon={<Users size={14} />} />
            <SectionIndicator label="Lead" value={stats.lead} icon={<Award size={14} />} />
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
    {/* Background accent - Refined for mobile */}
    <div 
      className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-[0.08] pointer-events-none translate-x-1/2 -translate-y-1/2 rounded-full" 
      style={{ 
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(30px)' 
      }}
    ></div>
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
