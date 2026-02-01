
import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats(db.getStats());
  }, []);

  if (!stats) return <div>Loading...</div>;

  const levelData = Object.entries(stats.levelCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0d5c46', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">Live data updated just now</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Registrations', value: stats.total, icon: 'fa-users', color: 'blue' },
          { label: 'Today Expected', value: stats.todayExpected, icon: 'fa-calendar-day', color: 'amber' },
          { label: 'Checked In', value: stats.checkedIn, icon: 'fa-check-circle', color: 'emerald' },
          { label: 'Slot Utilization', value: `${Math.round((stats.total / 100) * 100)}%`, icon: 'fa-chart-pie', color: 'purple' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-${card.color}-500`}>
              <i className={`fas ${card.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Level Breakdown Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-gray-700">Students by Arabic Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0d5c46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Check-in Ratio */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-6 text-gray-700">Check-In Status</h3>
          <div className="h-64 flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Checked In', value: stats.checkedIn },
                    { name: 'Pending', value: stats.total - stats.checkedIn }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#0d5c46" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 md:mt-0 md:ml-6 space-y-2">
              <div className="flex items-center"><div className="w-3 h-3 bg-ibaana-primary rounded-full mr-2"></div> <span className="text-sm">Checked In: {stats.checkedIn}</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div> <span className="text-sm">Pending: {stats.total - stats.checkedIn}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Today's Appointments</h3>
          <button className="text-ibaana-primary text-sm font-semibold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-400 border-b">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {db.getStudents().slice(0, 5).map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition text-sm">
                  <td className="px-6 py-4 font-medium">{s.fullName}</td>
                  <td className="px-6 py-4">{s.arabicLevel}</td>
                  <td className="px-6 py-4 font-mono text-gray-500">{s.registrationCode}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {s.checkedIn ? 'Checked-In' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {db.getStudents().length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No registrations recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
