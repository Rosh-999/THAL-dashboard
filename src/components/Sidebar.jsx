import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Briefcase, History, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard Overview', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'THAL Detailed Score', icon: <BarChart2 size={20} />, path: '/detailed-score' },
    { name: 'Department View', icon: <Briefcase size={20} />, path: '/departments' },
    { name: 'Previous Reports', icon: <History size={20} />, path: '/reports' },
  ];

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white font-bold text-xl">
          T
        </div>
        <div>
          <h2 className="text-lg font-bold leading-none">THAL</h2>
          <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Dashboard Pro</p>
        </div>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-glass-border">
        <button className="nav-link w-full text-left hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
