export const generateDummyData = () => {
  const departments = ['SmartApp', 'Finoops', 'TechHubs'];
  const data = [];

  for (let i = 1; i <= 50; i++) {
    const dept = departments[i % 3];
    
    // Generate somewhat realistic scores based on department to create distinct clusters
    let baseScore = 3;
    if (dept === 'SmartApp') baseScore = 4; // High Tech
    if (dept === 'Finoops') baseScore = 2;  // Lower overall
    if (dept === 'TechHubs') baseScore = 3.5;

    const randomScore = (base) => {
      const score = base + (Math.random() * 2 - 1); // +/- 1
      return Math.max(1, Math.min(5, Math.round(score)));
    };

    data.push({
      id: `emp-${i}`,
      name: `Employee ${i}`,
      organisation: 'Acme Corp',
      department: dept,
      Timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      T1: randomScore(baseScore), T2: randomScore(baseScore), T3: randomScore(baseScore), T4: randomScore(baseScore),
      H1: randomScore(baseScore > 3 ? 3 : 4), H2: randomScore(baseScore > 3 ? 3 : 4), H3: randomScore(baseScore > 3 ? 3 : 4), H4: randomScore(baseScore > 3 ? 3 : 4),
      A1: randomScore(baseScore), A2: randomScore(baseScore), A3: randomScore(baseScore), A4: randomScore(baseScore),
      L1: randomScore(3), L2: randomScore(4), L3: randomScore(3), L4: randomScore(4),
    });
  }
  return data;
};
