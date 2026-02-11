
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME, LOGO_URL, OFFICIAL_SITE_URL } from '../../constants.tsx';
import { db } from '../../services/dbService';
import { AdminUser } from '../../types';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const isHome = location.pathname === '/';
  const config = db.getConfig();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdmin) {
      setCurrentUser(db.getCurrentUser());
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <span className="ms-4 font-black text-xs uppercase tracking-[0.2em] text-ibaana-primary hidden lg:block">
                IntakeFlow
              </span>
            )}
            {isAdmin && (
              <span className="ms-4 font-black text-xs uppercase tracking-widest text-white border-s border-gray-600 ps-4 hidden sm:block">
                Staff Ops
              </span>
            )}
          </Link>
          
          <nav className="hidden md:flex space-x-6 items-center">
            {!isAdmin && (
              <>
                <LanguageSwitcher />
                <a 
                  href={OFFICIAL_SITE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-ibaana-primary transition flex items-center"
                >
                  {t('official_site')} <i className="fas fa-external-link-alt ms-2 opacity-50 text-[8px]"></i>
                </a>
                {config.registrationOpen ? (
                  <Link 
                    to="/enroll" 
                    className="text-[10px] font-black uppercase tracking-widest text-white bg-ibaana-primary px-8 py-3 rounded-2xl hover:bg-emerald-900 transition shadow-lg shadow-emerald-900/10"
                  >
                    {t('book_assessment')}
                  </Link>
                ) : (
                  <div 
                    className="text-[10px] font-black uppercase tracking-widest text-white bg-gray-500 px-8 py-3 rounded-2xl cursor-not-allowed"
                    title={t('booking_closed_tooltip')}
                  >
                    {t('booking_closed')}
                  </div>
                )}
              </>
            )}
            
            {isAdmin && currentUser && (
              <>
                <Link to="/admin" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Dashboard</Link>
                <Link to="/admin/check-in" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Check-In</Link>
                <Link to="/admin/schedule" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Schedule</Link>
                <Link to="/admin/notifications" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Notifications</Link>
                <Link to="/admin/users" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Users</Link>
                <Link to="/admin/settings" className="text-gray-300 hover:text-white transition text-xs font-black uppercase tracking-widest">Settings</Link>
                
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-700 px-3 py-2 rounded-lg">
                    <span className="text-white font-bold text-sm">{currentUser.username}</span>
                    <i className={`fas fa-chevron-down text-white/50 text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        <p className="font-bold text-gray-800">{currentUser.username}</p>
                        <p>{currentUser.role}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/')} 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <i className="fas fa-sign-out-alt me-2"></i> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!isAdmin && (
              <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ibaana-primary">{t('staff_login')}</Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
             <Link to={isAdmin ? "/admin" : (config.registrationOpen ? "/enroll" : "#")} className={`bg-ibaana-primary text-white p-3 rounded-xl shadow-lg ${!config.registrationOpen && !isAdmin ? 'bg-gray-500 cursor-not-allowed' : ''}`}>
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
                <a href={OFFICIAL_SITE_URL} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ibaana-primary transition">{t('official_site')}</a>
                <a href="#contact" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ibaana-primary transition">{t('campus_info')}</a>
             </div>
            <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-md leading-relaxed">
              &copy; {new Date().getFullYear()} {t('footer_copyright')}
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
