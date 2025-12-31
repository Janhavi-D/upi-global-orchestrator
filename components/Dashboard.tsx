import React from 'react';
import { 
  Globe, 
  Clock, 
  Plus, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Transaction } from '../types';
import { ChartContainer } from './ui/chart';

interface DashboardProps {
  balance: number;
  transactions: Transaction[];
  onScanClick: () => void;
}

const chartData = [
  { name: 'M', val: 4000 },
  { name: 'T', val: 3000 },
  { name: 'W', val: 5000 },
  { name: 'T', val: 2780 },
  { name: 'F', val: 6890 },
  { name: 'S', val: 2390 },
  { name: 'S', val: 7490 },
];

export const Dashboard: React.FC<DashboardProps> = ({ balance, transactions, onScanClick }) => {
  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Navbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Orchestrator</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Universal Node</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold">BaaS Online</span>
        </div>
      </div>

      {/* Hero Balance Card */}
      <div className="relative group perspective-1000">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
        <div className="relative glass rounded-[2.5rem] p-8 overflow-hidden">
          {/* Subtle patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>

          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-[0.15em]">Settlement Balance</p>
              <h2 className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-sm">
                ₹{balance.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="p-3 glass rounded-2xl">
              <Zap size={22} className="text-sky-400" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
                 <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-sky-500/20 flex items-center justify-center text-[8px] font-bold text-sky-400">
                   +4
                 </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Active Bridge Nodes</p>
            </div>

            <button 
              onClick={onScanClick}
              className="btn-premium w-full py-4 bg-white text-slate-950 font-extrabold rounded-2xl flex items-center justify-center gap-3 text-sm tracking-tight"
            >
              <Plus size={20} />
              Scan Payment QR
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-[1.5rem] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <TrendingUp size={14} className="text-sky-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Market</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-500">USD/INR</span>
              <span className="text-[11px] font-mono text-white">89.96</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-500">EUR/INR</span>
              <span className="text-[11px] font-mono text-white">105.0</span>
            </div>
          </div>
        </div>

        <div className="glass-dark rounded-[1.5rem] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <ShieldCheck size={14} className="text-indigo-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-tight">
            ISO-20022 Handshake Ready. Bridge verified.
          </p>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="glass-dark rounded-[2rem] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity Velocity</h3>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
             <ArrowUpRight size={12} />
             <span className="text-[10px] font-bold">+12.4%</span>
          </div>
        </div>
        
        <ChartContainer>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke="#38bdf8" 
                strokeWidth={3}
                fill="url(#gradientArea)" 
                animationDuration={1500}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(2, 6, 23, 0.8)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  fontSize: '10px'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Transactions */}
      <div className="flex flex-col gap-4 pb-12">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Node Ledger</h3>
          <button className="text-[10px] font-bold text-sky-400 flex items-center gap-1 hover:opacity-80 transition-opacity">
            HISTORY <ChevronRight size={12} />
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-dark hover:glass rounded-2xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer group border-transparent hover:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-sky-500/10 group-hover:text-sky-400 transition-colors">
                  <Globe size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">{tx.merchant}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500 font-mono">{tx.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-[10px] text-sky-500/80 font-bold uppercase">{tx.currency}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white tracking-tight">-₹{tx.inrValue.toFixed(2)}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.currency} {tx.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
