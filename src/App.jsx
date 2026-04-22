import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import DetailedScore from './pages/DetailedScore';
import DepartmentView from './pages/DepartmentView';
import PreviousReports from './pages/PreviousReports';
import { useSurveyData } from './hooks/useSurveyData';
import { calculateMetrics } from './utils/calculations';
import { generateDummyData } from './utils/dummyData';

const App = () => {
  const { data: realData, loading, error } = useSurveyData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use ONLY dummy data as requested by the user
  // const displayData = useMemo(() => {
  //   const dummy = generateDummyData();
  //   return dummy.map(d => calculateMetrics(d));
  // }, []);
  // Map over the real Firebase data to attach calculated THAL scores
  const displayData = useMemo(() => {
    return realData || []
  }, [realData]);

  if (loading) return <div className="p-8 text-white">Loading live data...</div>;
  if (error) return <div className="p-8 text-red-500">Error connecting to Firebase: {error.message}</div>;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="app-container">
        <header className={`global-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
           <h1 className="text-xl font-bold text-[#fcf8f1]">THAL Dashboard</h1>
           <button onClick={toggleSidebar} className="menu-trigger">
             <Menu size={20} />
           </button>
        </header>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            <Route path="/" element={<Overview data={displayData} />} />
            <Route path="/detailed-score" element={<DetailedScore data={displayData} />} />
            <Route path="/departments" element={<DepartmentView data={displayData} />} />
            <Route path="/reports" element={<PreviousReports currentData={displayData} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
