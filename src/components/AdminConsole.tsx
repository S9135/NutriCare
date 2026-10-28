import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Search, 
  Trash2, 
  UserMinus, 
  CheckCircle, 
  Activity, 
  FileText, 
  Eye,
  Database,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../App';

interface AdminConsoleProps {
  onLogout: () => void;
}

// Mock Data for Admin Console
const MOCK_USERS: (UserProfile & { id: string; status: 'active' | 'pending' | 'revoked'; joined: string })[] = [
  {
    id: 'usr_01',
    name: 'Alice Johnson',
    age: 28,
    gender: 'female',
    weight: 62,
    height: 168,
    email: 'alice@example.com',
    contact: '+1 555-0101',
    emergencyName: 'Bob Johnson',
    emergencyPhone: '+1 555-0102',
    activityLevel: 'moderate',
    status: 'active',
    joined: '2026-10-15'
  },
  {
    id: 'usr_02',
    name: 'Marcus Chen',
    age: 42,
    gender: 'male',
    weight: 85,
    height: 182,
    email: 'm.chen@tech.org',
    contact: '+1 555-0201',
    emergencyName: 'Sarah Chen',
    emergencyPhone: '+1 555-0202',
    activityLevel: 'sedentary',
    status: 'pending',
    joined: '2026-10-24'
  },
  {
    id: 'usr_03',
    name: 'Elena Rodriguez',
    age: 35,
    gender: 'female',
    weight: 58,
    height: 160,
    email: 'elena.r@lifestyle.com',
    contact: '+1 555-0301',
    emergencyName: 'Carlos R.',
    emergencyPhone: '+1 555-0302',
    activityLevel: 'very',
    status: 'active',
    joined: '2026-09-12'
  }
];

const MOCK_LOGS = [
  { id: 1, type: 'meal', user: 'Alice Johnson', action: 'Glycemic Scan', impact: 'Medium Spike', timestamp: '12 mins ago' },
  { id: 2, type: 'lab', user: 'Elena Rodriguez', action: 'Lab Analysis', impact: 'Blood Panel Verified', timestamp: '45 mins ago' },
  { id: 3, type: 'system', user: 'SYSTEM', action: 'Auth Audit', impact: 'Session Validated', timestamp: '1 hour ago' },
];

export default function AdminConsole({ onLogout }: AdminConsoleProps) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (id: string, action: 'approve' | 'revoke' | 'delete') => {
    if (action === 'delete') {
      setUsers(users.filter(u => u.id !== id));
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, status: action === 'approve' ? 'active' : 'revoked' } : u));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Stats Banner */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: users.length, icon: Users, color: 'text-cyan-500' },
          { label: 'Pending Verification', value: users.filter(u => u.status === 'pending').length, icon: ShieldAlert, color: 'text-amber-500' },
          { label: 'Neural Throughput', value: '0.8s', icon: Activity, color: 'text-emerald-500' },
          { label: 'Audit Compliance', value: '100%', icon: Database, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-mono font-bold text-white tabular-nums">{stat.value}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Management List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Patient Directory</h2>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search identity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <th className="pb-4 pl-4">Patient Identity</th>
                    <th className="pb-4">Biometric Status</th>
                    <th className="pb-4">Ecosystem Access</th>
                    <th className="pb-4 text-right pr-4">Oversight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-900/50 transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">{user.name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-300 uppercase">{user.age}Y · {user.weight}kg</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          user.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.status === 'pending' && (
                            <button 
                              onClick={() => handleAction(user.id, 'approve')}
                              className="p-2 text-slate-500 hover:text-emerald-400 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleAction(user.id, 'revoke')}
                            className="p-2 text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleAction(user.id, 'delete')}
                            className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">System Telemetry Logs</h2>
            </div>
            <div className="space-y-4">
              {MOCK_LOGS.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      log.type === 'meal' ? 'bg-cyan-500/10 text-cyan-400' :
                      log.type === 'lab' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {log.type === 'meal' ? <UtensilsIcon className="w-4 h-4" /> : log.type === 'lab' ? <FileText className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{log.action}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{log.user} · {log.impact}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 uppercase mt-1">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected User Detail Card */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <motion.div
                key={selectedUser.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-8 sticky top-24"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                    <Users className="w-6 h-6 text-cyan-500" />
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-1 text-slate-600 hover:text-white"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h3>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em]">Patient ID: {selectedUser.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-slate-800 py-6">
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Contact</p>
                      <p className="text-sm text-slate-300">{selectedUser.contact}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Joined</p>
                      <p className="text-sm text-slate-300">{selectedUser.joined}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono uppercase text-rose-400 tracking-widest">Emergency Contact</h4>
                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                      <p className="text-sm font-bold text-white mb-1">{selectedUser.emergencyName}</p>
                      <p className="text-sm text-rose-400">{selectedUser.emergencyPhone}</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button className="w-full py-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm mb-3">
                      View Full Bio-History
                    </button>
                    <button className="w-full py-3 bg-rose-600/10 border border-rose-500/50 text-rose-400 rounded-xl font-bold hover:bg-rose-600/20 transition-all text-sm uppercase tracking-widest">
                      Restrict Access
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#0B0E17] border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center text-slate-600 h-full min-h-[400px]">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-mono uppercase tracking-[0.2em]">Select patient for oversight</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Internal icons to avoid import noise
function UtensilsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
