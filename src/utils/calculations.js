/**
 * THAL CALCULATION ENGINE (PRO VERSION)
 * 
 * Logic:
 * X (Tech) = (Transform + Adapt) / 2
 * Y (Workforce) = (Humanize + Lead) / 2
 * 
 * Thresholds:
 * - Leader: Tech >= 70%, Workforce >= 70%
 * - People-Centric: Tech < 70%, Workforce >= 70%
 * - Tech-Driven: Tech >= 70%, Workforce < 70%
 * - Fragmented: Tech < 50%, Workforce < 50%
 * - Transition Zone: 50% - 70%
 */

export const calculateMetrics = (data) => {
  const getSectionAvg = (prefix, row) => {
    let sum = 0;
    let count = 0;
    for (let i = 1; i <= 4; i++) {
      const val = parseFloat(row[`${prefix}${i}`]);
      if (!isNaN(val)) {
        sum += val;
        count++;
      }
    }
    // Normalize to 0-100 range based on 1-5 scale
    // (Avg / 5) * 100
    return count > 0 ? (sum / count / 5) * 100 : 0;
  };

  const transform = getSectionAvg('T', data);
  const humanize = getSectionAvg('H', data);
  const adapt = getSectionAvg('A', data);
  const lead = getSectionAvg('L', data);

  const techScore = (transform + adapt) / 2;
  const workforceScore = (humanize + lead) / 2;

  const rawDept = data.Department || data.department || 'N/A';

  // Normalize department names dynamically without hardcoding
  const normalizeDepartment = (dept) => {
    if (!dept) return 'N/A';

    // 1. Convert to Title Case (e.g., "smart apps" -> "Smart Apps")
    const titleCased = dept.trim().toLowerCase().replace(/\b\w/g, c => c.toLowerCase());

    // 2. Remove all spaces, hyphens, and underscores to group variations
    // "Smart Apps" -> "SmartApps", "marketing-dept" -> "MarketingDept"
    return titleCased.replace(/[\s\-_]/g, '');
  };

  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    name: data.Name || data.name || 'Anonymous',
    organisation: data['Organisation Name'] || data.organisation || 'Unknown',
    department: normalizeDepartment(rawDept),
    timestamp: data.Timestamp || new Date().toISOString(),
    transform,
    humanize,
    adapt,
    lead,
    techScore,
    workforceScore,
    quadrant: getQuadrant(techScore, workforceScore),
    status: getStatusLabel(techScore, workforceScore)
  };
};

export const getQuadrant = (tech, workforce) => {
  if (tech >= 70 && workforce >= 70) return 'THAL Leader';
  if (tech < 70 && workforce >= 70) return 'People-Centric';
  if (tech >= 70 && workforce < 70) return 'Tech-Driven';
  if (tech < 50 && workforce < 50) return 'Fragmented';
  return 'Transition Zone';
};

export const getStatusLabel = (tech, workforce) => {
  if (tech >= 70 && workforce >= 70) return 'High Maturity';
  if (tech >= 50 && tech < 70 || workforce >= 50 && workforce < 70) {
    return 'Transitioning toward THAL Leader';
  }
  return 'Development Required';
};

export const getQuadrantDetails = (quadrant) => {
  switch (quadrant) {
    case 'THAL Leader':
      return {
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        desc: 'Q1 – THAL Leader: High AI adoption, employee confidence, and balanced hybrid work. Market leadership in efficiency and innovation.',
        oneLiner: 'From being efficient to becoming industry leaders.',
        situation: 'Strong AI adoption, high employee confidence, effective leadership, and balanced hybrid work.',
        recommendation: 'Sustain & Scale Leadership: Scale AI across more functions, invest in governance/ethics, and build CoEs.',
        todo: [
          'Scale AI across more business functions',
          'Invest in advanced capabilities (AI governance, ethical AI)',
          'Build innovation labs / CoEs (Centers of Excellence)',
          'Mentor other teams or business units'
        ],
        focus: 'Move from efficiency → innovation leadership (AI-driven decision-making, predictive systems).',
        risk: 'Complacency and over-optimization without innovation.'
      };
    case 'People-Centric':
      return {
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)',
        desc: 'Q2 – People-Centric: Strong culture and workforce readiness, but lagging in technology modernization and AI capability.',
        oneLiner: 'You have the people—now empower them with technology.',
        situation: 'Employees are ready and engaged with strong leadership, but AI adoption is low and legacy systems dominate.',
        recommendation: 'Accelerate Technology Adoption: Introduce AI in phases (PoC → scale) and modernize legacy digital infrastructure.',
        todo: [
          'Introduce AI tools in phases (PoC → scale)',
          'Modernize legacy systems (API-first approach)',
          'Invest in digital infrastructure',
          'Provide hands-on AI training (not just theory)'
        ],
        focus: 'Convert human readiness → digital capability.',
        risk: 'Falling behind competitors and talent frustration due to outdated tools.'
      };
    case 'Tech-Driven':
      return {
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        desc: 'Q4 – Tech-Driven: Advanced tools and systems adoption, but hindered by employee fear, low trust, and poor leadership alignment.',
        oneLiner: 'Technology alone doesn’t transform—people do.',
        situation: 'Strong AI/tools adoption and good systems, but plagued by employee fear, low trust, burnout, and misalignment.',
        recommendation: 'Humanize the Transformation: Launch AI awareness programs and redesign roles for human-AI collaboration.',
        todo: [
          'Launch AI awareness & confidence programs',
          'Redesign roles (clarify human vs AI tasks)',
          'Introduce outcome-based performance models',
          'Train leaders in people-centric management'
        ],
        focus: 'Shift from technology push → human adoption.',
        risk: 'Resistance to AI, high attrition, and misuse of tools.'
      };
    case 'Fragmented':
      return {
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        desc: 'Q3 – Fragmented: Foundational weaknesses in both AI adoption and leadership alignment. High resistance to change.',
        oneLiner: 'Fix the foundation before scaling transformation.',
        situation: 'Low AI adoption, poor leadership alignment, low employee confidence, and high resistance to change.',
        recommendation: 'Stabilize First, Then Transform: Focus on leadership alignment, clear vision, and building foundational trust.',
        todo: [
          'Start with leadership alignment & define clear vision',
          'Communicate change strategy & build trust',
          'Show quick wins (low-risk AI use cases)',
          'Invest in basic digital literacy & AI training'
        ],
        focus: 'Move to Q2 (People-Centric) first by building people capability.',
        risk: 'Change fatigue, resistance collapse, and transformation failure.'
      };
    case 'Transition Zone':
      return {
        color: '#a855f7',
        bg: 'rgba(168, 85, 247, 0.1)',
        desc: 'Transition Zone: Maturity is developing but not yet fully achieved. Standardizing successful pilots is key.',
        oneLiner: 'Moving toward excellence through consistency.',
        situation: 'Mixed results with some successful pilots but inconsistent adoption across the organization.',
        recommendation: 'Formalize and Scale: Standardize processes and expand successful AI initiatives across all departments.',
        todo: [
          'Document best practices from successful pilots',
          'Standardize AI tools and platforms',
          'Expand training programs',
          'Align departmental goals with THAL vision'
        ],
        focus: 'Achieving consistency to cross into the Leader quadrant.',
        risk: 'Stalling in transition or losing momentum.'
      };
    default:
      return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', desc: 'Unknown state.', recommendation: 'No specific advice available.', oneLiner: '', situation: '', todo: [], focus: '', risk: '' };
  }
};

/**
 * Aggregates individual scores into organizational or departmental averages.
 */
export const aggregateScores = (dataList) => {
  if (!dataList.length) return null;

  const count = dataList.length;
  const totals = dataList.reduce((acc, curr) => {
    acc.t += curr.transform;
    acc.h += curr.humanize;
    acc.a += curr.adapt;
    acc.l += curr.lead;
    return acc;
  }, { t: 0, h: 0, a: 0, l: 0 });

  const avgT = totals.t / count;
  const avgH = totals.h / count;
  const avgA = totals.a / count;
  const avgL = totals.l / count;

  const tech = (avgT + avgA) / 2;
  const people = (avgH + avgL) / 2;

  return {
    transform: avgT,
    humanize: avgH,
    adapt: avgA,
    lead: avgL,
    techScore: tech,
    workforceScore: people,
    quadrant: getQuadrant(tech, people),
    attendees: count
  };
};
