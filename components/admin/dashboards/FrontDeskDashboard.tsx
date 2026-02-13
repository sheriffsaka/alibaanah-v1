
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../../services/dbService';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { UserRole, Student } from '../../../types';

const FrontDeskDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const genderFilter = user.role === UserRole.SUPER_ADMIN ? undefined : user.gender;
      setStats(db.getStats(genderFilter));
      setStudents(db.getStudents(genderFilter));
    }
  }, [user]);

  if (!stats || !user) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Front Desk Operations ({user.gender})</h1>
          <p className="text-gray-500">Welcome, {user?.username}!</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border-t-4 border-ibaana-primary flex flex-col justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Ready to Check In Students?</h2>
            <p className="text-gray-500 mt-2 mb-6">Use the scanner for QR codes or search by name/phone number to quickly process arriving students.</p>
          </div>
          <Link 
            to="/admin/check-in" 
            className="bg-ibaana-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-900 transition flex items-center"
          >
            <i className="fas fa-qrcode mr-3"></i> Go to Check-In Scanner
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-sky-500">
              <i className="fas fa-calendar-day text-xl"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Today's Expected</p>
              <p className="text-2xl font-bold">{stats.todayExpected}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-emerald-500">
              <i className="fas fa-user-check text-xl"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Checked-In So Far</p>
              <p className="text-2xl font-bold">{stats.checkedIn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Arrivals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Today's Arrivals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-400 border-b">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.slice(0, 10).map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition text-sm">
                  <td className="px-6 py-4 font-medium">{s.fullName}</td>
                  <td className="px-6 py-4 font-mono text-gray-500">{s.registrationCode}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {s.checkedIn ? 'Checked-In' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">No registrations recorded yet for your section.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FrontDeskDashboard;