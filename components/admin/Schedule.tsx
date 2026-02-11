
import React, { useState, useMemo } from 'react';
import { db } from '../../services/dbService';
import { AppointmentSlot } from '../../types';

const Schedule: React.FC = () => {
  const [slots, setSlots] = useState<AppointmentSlot[]>(db.getSlots());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<Partial<AppointmentSlot> | null>(null);
  const [error, setError] = useState('');

  const openModal = (slot: Partial<AppointmentSlot> | null = null) => {
    setError('');
    setCurrentSlot(slot ? { ...slot } : { date: '', startTime: '09:00', endTime: '10:30', capacity: 20, gender: 'Male' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSlot(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSlot) return;

    try {
      if (currentSlot.id) {
        // Update
        db.updateSlot(currentSlot.id, { capacity: currentSlot.capacity, gender: currentSlot.gender });
      } else {
        // Create
        db.addSlot({
          date: currentSlot.date || '',
          startTime: currentSlot.startTime || '',
          endTime: currentSlot.endTime || '',
          capacity: currentSlot.capacity || 0,
          gender: currentSlot.gender || 'Male',
        });
      }
      setSlots([...db.getSlots()]);
      closeModal();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this slot? This cannot be undone.')) {
      try {
        db.deleteSlot(id);
        setSlots([...db.getSlots()]);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentSlot) {
      setCurrentSlot({ ...currentSlot, [name]: name === 'capacity' ? parseInt(value, 10) : value });
    }
  };
  
  const groupedSlots = useMemo(() => {
    return slots.reduce((acc, slot) => {
      const date = new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {} as Record<string, AppointmentSlot[]>);
  }, [slots]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <button onClick={() => openModal()} className="bg-ibaana-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-900 transition">
          <i className="fas fa-plus mr-2"></i> Add New Slot
        </button>
      </div>

      <div className="space-y-8">
        {Object.keys(groupedSlots).map((date) => (
          <div key={date}>
            <h2 className="font-bold text-lg mb-3 border-b pb-2">{date}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedSlots[date].map(slot => (
                <div key={slot.id} className={`bg-white rounded-lg shadow-sm border p-4 flex flex-col justify-between border-l-4 ${slot.gender === 'Male' ? 'border-blue-500' : 'border-pink-500'}`}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-lg">{slot.startTime} - {slot.endTime}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${slot.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {slot.gender}
                      </span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden my-2">
                        <div 
                          className="absolute top-0 left-0 h-full bg-ibaana-primary" 
                          style={{ width: `${(slot.enrolledCount / slot.capacity) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">{slot.enrolledCount}</span> of <span className="font-semibold">{slot.capacity}</span> seats booked
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex space-x-2">
                    <button onClick={() => openModal(slot)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
                    <span>&middot;</span>
                    <button 
                      onClick={() => handleDelete(slot.id)} 
                      disabled={slot.enrolledCount > 0}
                      className="text-xs font-semibold text-red-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                      title={slot.enrolledCount > 0 ? "Cannot delete slot with enrollments" : ""}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {slots.length === 0 && <p className="text-center text-gray-500 py-10">No appointment slots have been created yet.</p>}
      </div>

      {isModalOpen && currentSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{currentSlot.id ? 'Edit Slot' : 'Add New Slot'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input required type="date" name="date" value={currentSlot.date} onChange={handleInputChange} disabled={!!currentSlot.id} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender Designation</label>
                  <select name="gender" value={currentSlot.gender} onChange={handleInputChange} disabled={!!currentSlot.id && (currentSlot.enrolledCount ?? 0) > 0} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input required type="time" name="startTime" value={currentSlot.startTime} onChange={handleInputChange} disabled={!!currentSlot.id} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input required type="time" name="endTime" value={currentSlot.endTime} onChange={handleInputChange} disabled={!!currentSlot.id} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <input required type="number" name="capacity" min="1" value={currentSlot.capacity} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}
              </div>
              <div className="bg-gray-50 p-4 flex justify-end space-x-3 rounded-b-xl">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-ibaana-primary text-white rounded-md text-sm font-medium hover:bg-emerald-900">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;