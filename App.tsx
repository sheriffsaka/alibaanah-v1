
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/ui/Layout';
import LandingPage from './components/public/LandingPage';
import RegistrationFlow from './components/public/RegistrationFlow';
import AdmissionSlip from './components/public/AdmissionSlip';
import Dashboard from './components/admin/Dashboard';
import CheckIn from './components/admin/CheckIn';
import Users from './components/admin/Users';
import Settings from './components/admin/Settings';
import Schedule from './components/admin/Schedule';
import Notifications from './components/admin/Notifications';
import { LOGO_URL, OFFICIAL_SITE_URL } from './constants.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Public Student Routes */}
          <Route path="/" element={
            <Layout>
              <LandingPage />
            </Layout>
          } />
          
          <Route path="/enroll" element={
            <Layout>
              <div className="flex flex-col items-center text-center space-y-8 mb-16 pt-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-2">
                  <img 
                    src={LOGO_URL} 
                    alt="Al-Ibaanah Arabic Center" 
                    className="h-20 sm:h-24 w-auto object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                    <span className="text-ibaana-primary uppercase">Assessment</span> Booking
                  </h1>
                  <p className="max-w-xl mx-auto text-lg text-gray-500 font-light leading-relaxed">
                    Step 2 of 3: Reserve your placement interview. <br />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Make sure you have registered at <a href={OFFICIAL_SITE_URL} target="_blank" className="underline hover:text-ibaana-primary">ibaanah.com</a> first.</span>
                  </p>
                </div>
              </div>
              <RegistrationFlow />
            </Layout>
          } />
          
          <Route path="/confirmation/:id" element={
            <Layout>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full mb-6 border-4 border-white shadow-xl">
                  <i className="fas fa-check text-3xl"></i>
                </div>
                <h2 className="text-3xl font-black text-gray-900">Slot Reserved Successfully</h2>
                <p className="text-gray-500 mt-2 font-medium">Your digital intake slip is ready below.</p>
              </div>
              <AdmissionSlip />
            </Layout>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <Layout isAdmin>
              <Dashboard />
            </Layout>
          } />

          <Route path="/admin/check-in" element={
            <Layout isAdmin>
              <CheckIn />
            </Layout>
          } />
          
          <Route path="/admin/schedule" element={
            <Layout isAdmin>
              <Schedule />
            </Layout>
          } />
          
          <Route path="/admin/notifications" element={
            <Layout isAdmin>
              <Notifications />
            </Layout>
          } />

          <Route path="/admin/users" element={
            <Layout isAdmin>
              <Users />
            </Layout>
          } />
          
          <Route path="/admin/settings" element={
            <Layout isAdmin>
              <Settings />
            </Layout>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
