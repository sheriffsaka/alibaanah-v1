
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Student, AppointmentSlot } from '../../types';
import { db } from '../../services/dbService';
import { WHAT_TO_BRING_CHECKLIST, INSTITUTION_NAME, LOGO_URL } from '../../constants.tsx';
import html2canvas from 'html2canvas';
import qrcode from 'qrcode';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

const AdmissionSlip: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [student, setStudent] = useState<Student | null>(null);
  const [slot, setSlot] = useState<AppointmentSlot | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (id) {
      const s = db.getStudents().find(st => st.id === id);
      if (s) {
        setStudent(s);
        const sl = db.getSlotById(s.slotId);
        if (sl) setSlot(sl);
      }
    }
  }, [id]);

  useEffect(() => {
    if (student?.registrationCode && qrCanvasRef.current) {
      qrcode.toCanvas(qrCanvasRef.current, student.registrationCode, {
        width: 128,
        margin: 1,
        color: {
          dark: '#062e23',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [student]);

  if (!student || !slot) return <div className="text-center py-20 font-medium text-gray-500">{t('slip_not_found')}</div>;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!slipRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(slipRef.current, {
        useCORS: true,
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `Al-Ibaanah-Intake-${student.registrationCode}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('There was an error generating your download. Please try the Print option instead.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div 
        ref={slipRef}
        className="bg-white p-10 rounded-2xl shadow-2xl border-t-[12px] border-ibaana-primary relative overflow-hidden admission-slip"
      >
        {/* Watermark Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
          <img src={LOGO_URL} alt="watermark" className="w-[500px] grayscale" crossOrigin="anonymous" />
        </div>

        {/* Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 relative z-10">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <img 
              src={LOGO_URL} 
              alt="Al-Ibaanah Logo" 
              className="h-20 w-auto object-contain" 
              crossOrigin="anonymous"
            />
            <div className="border-s border-gray-200 ps-6">
              <h1 className="text-2xl font-black text-ibaana-primary leading-tight uppercase tracking-tight">
                {INSTITUTION_NAME}
              </h1>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">{t('admission_slip')}</p>
            </div>
          </div>
          <div className="text-left md:text-right bg-gray-50 p-4 rounded-xl border border-gray-100 min-w-[180px]">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t('registration_id')}</div>
            <div className="text-2xl font-mono font-black text-ibaana-red tracking-wider">{student.registrationCode}</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('student_info')}</label>
              <p className="text-xl font-bold text-gray-900">{student.fullName}</p>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('target_level')}</label>
                <p className="text-lg font-bold text-ibaana-primary">{t(`level_${student.arabicLevel.toLowerCase()}`)}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('internal_group')}</label>
                <p className="text-lg font-bold text-ibaana-primary">{student.groupNumber}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('campus_address')}</label>
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                {t('campus_address_l1')}<br />
                {t('campus_address_l2')}
              </p>
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-2xl text-white flex flex-col items-center justify-center text-center shadow-lg transform rotate-1 md:rotate-2">
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.3em] mb-4">{t('confirmed_appointment')}</div>
            
            <div className="text-5xl font-black mb-2">
              {new Date(slot.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </div>
            
            <div className="text-xl font-medium text-emerald-100 opacity-90">
              {slot.startTime} — {slot.endTime}
            </div>

            <div className="mt-8 p-3 bg-white rounded-xl shadow-inner">
              <div className="w-32 h-32 bg-white flex items-center justify-center border border-gray-100">
                <canvas ref={qrCanvasRef}></canvas>
              </div>
            </div>
            <p className="text-[10px] mt-4 text-emerald-300 font-medium">{t('qr_validity')}</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-12 pt-8 border-t border-gray-100 relative z-10">
          <h4 className="text-sm font-black text-gray-800 mb-6 flex items-center uppercase tracking-widest">
            <i className="fas fa-clipboard-list me-3 text-ibaana-primary text-lg"></i>
            {t('entry_requirements')}
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WHAT_TO_BRING_CHECKLIST.map((_, idx) => (
              <li key={idx} className="text-xs text-gray-600 font-medium flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <i className="fas fa-circle-check me-3 text-emerald-600 text-sm"></i>
                {t(`checklist_${idx+1}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] relative z-10 py-4 border-t border-gray-50 italic">
          {t('slip_footer')}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden nav-buttons">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full sm:w-auto bg-ibaana-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-900 transition shadow-xl flex items-center justify-center disabled:opacity-50"
        >
          <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-download'} me-3`}></i> 
          {isDownloading ? t('downloading_button') : t('download_image_button')}
        </button>
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition shadow-xl flex items-center justify-center"
        >
          <i className="fas fa-print me-3"></i> {t('print_pdf_button')}
        </button>
        <Link 
          to="/"
          className="w-full sm:w-auto bg-white border-2 border-ibaana-primary text-ibaana-primary px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition flex items-center justify-center"
        >
          {t('back_portal_button')}
        </Link>
      </div>
    </div>
  );
};

export default AdmissionSlip;
