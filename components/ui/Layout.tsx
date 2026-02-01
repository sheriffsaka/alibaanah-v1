
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME, LOGO_URL, OFFICIAL_SITE_URL } from '../../constants.tsx';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className={`${isAdmin ? 'bg-gray-800 border-b border-gray-700' : 'bg-white/95 backdrop-blur-lg border-b border-gray-100'} shadow-sm sticky top-0 z-[100]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-50 group-hover:scale-105 transition duration-300">
              <img 
                src={LOGO_URL} 
                alt="Al-Ibaanah Logo" 
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as any).style.display = 'none';
                }}
              />
            </div>
            {!isAdmin && (
              <span className="ml-4 font-black text-xs uppercase tracking-[0.2em] text-ibaana-primary hidden lg:block">
                IntakeFlow
              </span>
            )}
            {isAdmin && (
              <span className="ml-4 font-black text-xs uppercase tracking-widest text-white border-l border-gray-600 pl-4 hidden sm:block">
                Staff Ops
              </span>
            )}
          </Link>
          
          <nav className="hidden md:flex space-x-10 items-center">
            {!isAdmin && (
              <>
                <a 
                  href={OFFICIAL_SITE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-ibaana-primary transition flex items-center"
                >
                  Official Site <i className="fas fa-external-link-alt ml-2 opacity-50 text-[8px]"></i>
                </a>
                <Link 
                  to="/enroll" 
                  className="text-[10px] font-black uppercase tracking-widest text-white bg-ibaana-primary px-8 py-3 rounded-2xl hover:bg-emerald-900 transition shadow-lg shadow-emerald-900/10"
                >
                  Book Assessment
                </Link>
              </>
            )}
            
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Dashboard</Link>
                <Link to="/admin/check-in" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Check-In</Link>
                <button 
                  onClick={() => navigate('/')} 
                  className="bg-red-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ibaana-primary">Staff Login</Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
             <Link to={isAdmin ? "/admin" : "/enroll"} className="bg-ibaana-primary text-white p-3 rounded-xl shadow-lg">
                <i className={`fas ${isAdmin ? 'fa-user-shield' : 'fa-user-plus'} text-lg`}></i>
             </Link>
          </div>
        </div>
      </header>

      <main className={`flex-grow ${isHome ? '' : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12'}`}>
        {children}
      </main>

      {!isHome && (
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
             <div className="flex gap-8 mb-6">
                <a href={OFFICIAL_SITE_URL} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ibaana-primary transition">Official Site</a>
                <a href="#contact" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ibaana-primary transition">Campus Info</a>
             </div>
            <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-md leading-relaxed">
              &copy; {new Date().getFullYear()} Al-Ibaanah Arabic Center | Nasr City, Cairo
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
