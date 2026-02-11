
import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { SystemConfig } from '../../types';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(db.getConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      db.updateConfig(config);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-ibaana-primary">
        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-bold text-gray-800">Registration Status</h3>
              <p className="text-sm text-gray-500">Enable or disable new student enrollments globally.</p>
            </div>
            <label htmlFor="registrationOpen" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="registrationOpen" 
                  name="registrationOpen"
                  className="sr-only peer" 
                  checked={config.registrationOpen}
                  onChange={handleInputChange}
                />
                <div className="block bg-gray-200 peer-checked:bg-emerald-500 w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">
                {config.registrationOpen ? 'OPEN' : 'CLOSED'}
              </div>
            </label>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-700">Capacity Rules</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Daily Campus Capacity</label>
              <input 
                type="number" 
                name="maxDailyCapacity"
                value={config.maxDailyCapacity}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <p className="mt-1 text-xs text-gray-500">Total number of students allowed on campus per day across all slots.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Group Size</label>
              <input 
                type="number" 
                name="maxGroupSize"
                value={config.maxGroupSize}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <p className="mt-1 text-xs text-gray-500">Max number of students assigned to a single group for evaluation.</p>
            </div>
          </div>
          
          <div className="pt-6 border-t flex justify-end items-center space-x-4">
            {showSuccess && <p className="text-emerald-600 font-medium text-sm animate-fade-in">Settings saved successfully!</p>}
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-ibaana-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-900 transition disabled:opacity-50 flex items-center"
            >
              {isSaving && <i className="fas fa-spinner fa-spin mr-2"></i>}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;
