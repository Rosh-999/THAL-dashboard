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
        desc: 'High scores across all questions. Organization is a market leader.',
        recommendation: 'Continue innovation and mentor other departments.'
      };
    case 'People-Centric':
      return {
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)',
        desc: 'Strong Workforce & Leadership, but lagging in Tech & Agility.',
        recommendation: 'Invest in technology adoption and process automation.'
      };
    case 'Tech-Driven':
      return {
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        desc: 'Strong Tech Maturity, but People & Culture metrics are low.',
        recommendation: 'Focus on workforce engagement and leadership training.'
      };
    case 'Fragmented':
      return {
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        desc: 'Low scores across both Technology and Workforce metrics.',
        recommendation: 'Urgent need for foundational organizational transformation.'
      };
    case 'Transition Zone':
      return {
        color: '#a855f7',
        bg: 'rgba(168, 85, 247, 0.1)',
        desc: 'Maturity is developing but not yet fully achieved.',
        recommendation: 'Standardize successful pilots to move into the Leader quadrant.'
      };
    default:
      return { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', desc: '', recommendation: '' };
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
