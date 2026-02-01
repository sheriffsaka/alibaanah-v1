
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArabicLevel, Student, AppointmentSlot } from '../../types';
import { db } from '../../services/dbService';
import { PROFICIENCY_DESCRIPTIONS } from '../../constants.tsx';

const RegistrationFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    age: 18,
    gender: 'Male' as 'Male' | 'Female',
    address: '',
    arabicLevel: ArabicLevel.BEGINNER,
    preferredDate: '',
    slotId: ''
  });

  useEffect(() => {
    setSlots(db.getSlots());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const submitRegistration = () => {
    try {
      const student = db.registerStudent(formData);
      navigate(`/confirmation/${student.id}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-ibaana-primary p-6 text-white text-center">
        <h2 className="text-2xl font-bold">New Student Enrollment</h2>
        <div className="flex justify-center mt-4 space-x-4">
          <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-amber-400' : 'bg-white/30'}`} />
          <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-amber-400' : 'bg-white/30'}`} />
          <div className={`h-2 w-12 rounded-full ${step >= 3 ? 'bg-amber-400' : 'bg-white/30'}`} />
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <form onSubmit={nextStep} className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Step 1: Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="As per ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="e.g. +20100..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input required type="number" name="age" min="5" value={formData.age} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Arabic Proficiency</label>
                <select name="arabicLevel" value={formData.arabicLevel} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  {Object.values(ArabicLevel).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Home Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={2} />
            </div>
            <button type="submit" className="w-full bg-ibaana-primary text-white py-3 rounded-lg font-bold hover:bg-emerald-900 transition mt-6">
              Continue to Booking
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Step 2: Choose Interview Slot</h3>
            <p className="text-sm text-gray-500 italic">Please select an available appointment time for your on-campus evaluation.</p>
            
            <div className="grid grid-cols-1 gap-3">
              {slots.map(slot => {
                const isFull = slot.enrolledCount >= slot.capacity;
                return (
                  <button
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setFormData(prev => ({ ...prev, slotId: slot.id, preferredDate: slot.date }))}
                    className={`p-4 border rounded-lg text-left transition ${
                      formData.slotId === slot.id 
                        ? 'border-ibaana-primary bg-emerald-50 ring-2 ring-ibaana-primary' 
                        : isFull ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'hover:border-ibaana-primary'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold block">{new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="text-gray-600">{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isFull ? 'FULL' : `${slot.capacity - slot.enrolledCount} slots left`}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50">Back</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!formData.slotId}
                className="flex-1 bg-ibaana-primary text-white py-3 rounded-lg font-bold hover:bg-emerald-900 transition disabled:opacity-50"
              >
                Review & Confirm
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Step 3: Review Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-bold">{formData.fullName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Level:</span> <span className="font-bold">{formData.arabicLevel}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Slot:</span> <span className="font-bold">{formData.preferredDate} at {slots.find(s => s.id === formData.slotId)?.startTime}</span></div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <p className="text-amber-800 text-xs flex items-start">
                <i className="fas fa-info-circle mt-1 mr-2"></i>
                By confirming, you agree to visit the campus on the selected date with the required documentation for the assessment.
              </p>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50">Back</button>
              <button onClick={submitRegistration} className="flex-1 bg-ibaana-primary text-white py-3 rounded-lg font-bold hover:bg-emerald-900 transition">
                Confirm Enrollment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;
