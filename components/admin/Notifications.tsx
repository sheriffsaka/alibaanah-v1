
import React, { useState } from 'react';
import { db } from '../../services/dbService';
import { SystemConfig, NotificationLog } from '../../types';

const EmailTemplatePreview: React.FC<{ title: string; subject: string; children: React.ReactNode }> = ({ title, subject, children }) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-3 bg-gray-50 border-b rounded-t-lg">
      <h4 className="font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="p-4 space-y-2 text-sm">
      <p><span className="font-semibold text-gray-500">Subject:</span> {subject}</p>
      <div className="border-t pt-3 mt-3 text-gray-600">
        {children}
      </div>
    </div>
  </div>
);


const Notifications: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>(db.getConfig());
  const [logs, setLogs] = useState<NotificationLog[]>(db.getNotificationLogs());
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newReminders = { ...config.reminders, [name]: checked };
    setConfig(prev => ({ ...prev, reminders: newReminders }));
    db.updateConfig({ reminders: newReminders });
  };
  
  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;
    setIsSending(true);
    setTimeout(() => {
        db.sendTestNotification(testEmail);
        setLogs([...db.getNotificationLogs()]);
        setIsSending(false);
        setTestEmail('');
    }, 1000);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Automated Communications</h1>
      </div>
      
      {/* Reminder Settings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Reminder Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'confirmationEmail', title: 'Booking Confirmation', description: 'Sent instantly after booking.' },
            { key: 'twentyFourHourEmail', title: '24-Hour Reminder', description: 'Sent the day before appointment.' },
            { key: 'dayOfEmail', title: 'Day-of Reminder', description: 'Sent morning of appointment.' },
          ].map(item => (
            <div key={item.key} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
               <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name={item.key} className="sr-only peer" checked={(config.reminders as any)[item.key]} onChange={handleToggleChange} />
                  <div className="block bg-gray-200 peer-checked:bg-emerald-500 w-11 h-6 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform peer-checked:translate-x-full"></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Email Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Email Templates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmailTemplatePreview title="Confirmation Email" subject="Your Al-Ibaanah Assessment is Confirmed!">
            <p>Dear [Student Name],</p>
            <p className="mt-2">Your assessment slot for [Date] at [Time] is confirmed. Your registration code is [Code]. Please bring the required documents.</p>
          </EmailTemplatePreview>
          <EmailTemplatePreview title="24-Hour Reminder" subject="Reminder: Your Al-Ibaanah Assessment is Tomorrow">
            <p>Dear [Student Name],</p>
            <p className="mt-2">This is a reminder for your assessment tomorrow, [Date] at [Time]. We look forward to seeing you.</p>
          </EmailTemplatePreview>
        </div>
      </div>
      
      {/* Test & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Test System</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-600 mb-4">Send a test notification to verify system functionality.</p>
                <form onSubmit={handleSendTest} className="flex space-x-2">
                    <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="Enter email address" required className="flex-grow border border-gray-300 rounded-md shadow-sm p-2" />
                    <button type="submit" disabled={isSending} className="bg-ibaana-primary text-white px-5 py-2 rounded-md font-bold hover:bg-emerald-900 transition disabled:opacity-50">
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Notification Log</h2>
            <div className="bg-white rounded-lg shadow-sm border max-h-72 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                        <tr>
                            <th className="p-3">Recipient</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td className="p-3 truncate">{log.recipient}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-xs ${log.type === 'Test' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{log.type}</span>
                                </td>
                                <td className="p-3 text-gray-500">{new Date(log.sentAt).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                         {logs.length === 0 && (
                            <tr><td colSpan={3} className="p-6 text-center text-gray-400">No notifications sent yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Notifications;
