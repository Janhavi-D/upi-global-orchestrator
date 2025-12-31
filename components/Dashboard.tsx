
import React from 'react';
import { 
  Globe, 
  Clock, 
  Plus, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { ChartContainer } from './ui/chart';

interface DashboardProps {
  balance: number;
  transactions: Transaction[];
  onScanClick: () => void;
}

const data = [
  { name: 'Mon', val: 4000 },
  { name: 'Tue', val: 3000 },
  { name: 'Wed', val: 2000 },
  { name: 'Thu', val: 2780 },
  { name: 'Fri', val: 1890 },
  { name: 'Sat', val: 2390 },
  { name: 'Sun', val: 3490 },
];

export const Dashboard: React.FC<DashboardProps> = ({ balance, transactions, onScanClick }) => {
  return (
    <div className="flex flex-col gap-5 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
            <LayoutDashboard size={18} className="text-sky-400" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Main Terminal</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono">Live Core Connectivity</span>
        </div>
      </div>

      {/* Balance Card - The Hero */}
      <div className="glass rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <Zap size={20} className="text-violet-500/50 group-hover:text-violet-400 transition-colors" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Available Settle Balance</p>
        <h2 className="text-4xl font-bold tracking-tighter text-white">
          ₹{balance.toLocaleString('en-IN')}
        </h2>
        <div className="mt-6 flex gap-3">
          <button 
            onClick={onScanClick}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-full flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            <Plus size={18} />
            Scan Global QR
          </button>
        </div>
        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* FX Benchmarks */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sky-400">
            <Globe size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">FX Benchmarks</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">USD</span>
              <span className="text-xs font-mono font-medium">89.96</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">EUR</span>
              <span className="text-xs font-mono font-medium">105.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">GBP</span>
              <span className="text-xs font-mono font-medium">121.0</span>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-violet-400">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">BaaS Bridge</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-300">
            Universal routing active via Sponsor Nodes. 
            <span className="block text-[10px] mt-1 text-slate-500">ISO-20022 ready</span>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="col-span-2 glass rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2 text-sky-400">
              <Clock size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Volume Dynamics</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono tracking-tighter">7 DAY OVERVIEW</span>
          </div>
          
          {/* SYSTEM BUILD INSTRUCTION: CHART ENGINE STABILITY */}
          
          <ChartContainer>
            <ResponsiveContainer width="100%" aspect={1.8}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#38bdf8" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex flex-col gap-3 mt-2 pb-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Global Ledger</h3>
          <button className="text-[10px] text-sky-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
            View All <ChevronRight size={10} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-sky-300 transition-colors">{tx.merchant}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">-₹{tx.inrValue.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400 font-mono">{tx.currency} {tx.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
