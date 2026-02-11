
import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { Student } from '../../types';
import { Html5QrcodeScanner } from 'html5-qrcode';

const CheckIn: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isScanning) return;
    
    const scanner = new Html5QrcodeScanner('qr-scanner', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    
    const onScanSuccess = (decodedText: string) => {
      setQuery(decodedText);
      handleSearch(null, decodedText);
      setIsScanning(false);
      scanner.clear();
    };
    
    scanner.render(onScanSuccess, undefined);

    return () => {
      scanner.getState() && scanner.clear().catch(err => console.error("Scanner clear failed", err));
    };
  }, [isScanning]);


  const handleSearch = (e: React.FormEvent | null, scanData: string | null = null) => {
    if (e) e.preventDefault();
    const searchQuery = scanData || query;

    setError('');
    setSuccess('');
    setResult(null);

    if(!searchQuery) {
        setError("Please provide a search query.");
        return;
    }

    try {
      const student = db.getStudents().find(s => 
        s.registrationCode === searchQuery || 
        s.phoneNumber === searchQuery || 
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (student) {
        setResult(student);
      } else {
        setError("No student found with that code or name.");
        setResult(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckIn = () => {
    if (!result) return;
    try {
      db.checkIn(result.registrationCode);
      setSuccess(`${result.fullName} has been successfully checked in.`);
      setResult({ ...result, checkedIn: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-ibaana-primary">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-id-card mr-3 text-ibaana-primary"></i>
          Front Desk Check-In
        </h2>
        
        {isScanning && (
          <div className="mb-6 animate-fade-in">
            <div id="qr-scanner" className="w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"></div>
            <button onClick={() => setIsScanning(false)} className="mt-4 w-full text-center text-gray-500 hover:text-red-500 font-semibold">
              Cancel Scan
            </button>
          </div>
        )}

        {!isScanning && (
          <div className="animate-fade-in">
            <form onSubmit={handleSearch} className="flex space-x-2 mb-8">
              <input
                autoFocus
                type="text"
                className="flex-grow border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-ibaana-primary outline-none"
                placeholder="Search by Code, Phone, or Name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="bg-ibaana-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-900 transition">
                Search
              </button>
            </form>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-6">
                <i className="fas fa-exclamation-circle mr-2"></i> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg flex items-center mb-6">
                <i className="fas fa-check-circle mr-2"></i> {success}
              </div>
            )}

            {result && (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{result.fullName}</h3>
                      <p className="text-sm text-gray-500 font-mono">{result.registrationCode}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.checkedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {result.checkedIn ? 'Checked-In' : 'Not Checked-In'}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Arabic Level</p>
                      <p className="font-semibold">{result.arabicLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Group Assignment</p>
                      <p className="font-semibold">Group {result.groupNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Contact</p>
                      <p className="font-semibold">{result.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold">Status</p>
                      <p className="font-semibold">{result.checkedIn ? 'Completed' : 'Awaiting Arrival'}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    {!result.checkedIn ? (
                      <button 
                        onClick={handleCheckIn}
                        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg flex items-center justify-center"
                      >
                        <i className="fas fa-sign-in-alt mr-2"></i> Confirm Check-In
                      </button>
                    ) : (
                      <div className="text-center py-2 text-emerald-600 font-bold">
                        <i className="fas fa-check-double mr-2"></i> Student is already in the system
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 text-center">
              <button onClick={() => setIsScanning(true)} className="text-gray-400 text-sm hover:text-gray-600">
                <i className="fas fa-qrcode mr-2"></i> Click to Open Camera Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;