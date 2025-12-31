import React, { useEffect } from 'react';
import { Check, Download, Share2, Globe, Clock, ShieldCheck, CreditCard } from 'lucide-react';
import { PaymentData } from '../types';
import { BRIDGE_FEE_PCT, GST_ON_FEE_PCT, FX_RATES } from '../constants';

interface SuccessReceiptProps {
  data: PaymentData;
  onDone: () => void;
}

export const SuccessReceipt: React.FC<SuccessReceiptProps> = ({ data, onDone }) => {
  const fx = FX_RATES[data?.originalCurrency || 'USD'] || FX_RATES['USD'];
  const currencySymbol = fx?.symbol || '$';
  
  const bridgeFee = (data?.inrAmount || 0) * BRIDGE_FEE_PCT;
  const gst = bridgeFee * GST_ON_FEE_PCT;
  const finalInr = (data?.inrAmount || 0) + bridgeFee + gst;

  useEffect(() => {
    const timer = setTimeout(onDone, 8000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-col h-screen p-8 animate-in fade-in duration-1000 bg-slate-950 overflow-y-auto">
      <div className="flex flex-col items-center gap-6 my-12 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
          <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_60px_rgba(16,185,129,0.5)] relative z-10 scale-110 animate-in zoom-in-50 duration-700">
            <Check size={48} strokeWidth={4} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white">Handshake Success</h2>
          <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mt-3 bg-emerald-500/10 px-4 py-1.5 rounded-full inline-block">
            Settlement Finalized
          </p>
        </div>
      </div>

      <div className="relative group perspective-1000">
        <div className="absolute -inset-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] blur-xl opacity-20"></div>
        <div className="glass rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col gap-8">
          {/* Realistic receipt cutouts */}
          <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-slate-950 border border-white/5 shadow-inner"></div>
          <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-slate-950 border border-white/5 shadow-inner"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Merchant Endpoint</p>
              <h3 className="text-xl font-extrabold text-white leading-tight">{data?.merchantName || 'Elite Vendor'}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Globe size={12} className="text-sky-400" />
                {data?.country || 'International Node'}
              </p>
            </div>
            <div className="text-right">
              <CreditCard size={20} className="text-slate-700 ml-auto mb-2" />
              <p className="text-[10px] font-mono text-slate-500">**** 4291</p>
            </div>
          </div>

          <div className="h-px border-t-2 border-dashed border-white/10 w-full"></div>

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Captured Bill</span>
              <span className="text-lg font-mono font-bold text-white tracking-tighter">{currencySymbol}{data?.originalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mid-Market Rate</span>
              <span className="text-xs font-mono text-white">1 {fx?.code} = ₹{fx?.rate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Orchestration Fee</span>
              <span className="text-xs font-mono text-white">₹{(bridgeFee + gst).toFixed(2)}</span>
            </div>
            
            <div className="pt-4 mt-4 border-t border-white/5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.25em] mb-1">Deduction Total</p>
                  <p className="text-3xl font-extrabold text-white tracking-tighter">₹{finalInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-2 bg-sky-500/10 rounded-xl">
                  <ShieldCheck size={20} className="text-sky-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-5 bg-white/5 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>ISO-20022 Network Clearance: #{(Math.random() * 1000000).toFixed(0)}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                  <Clock size={14} className="text-sky-500" />
                  <span>Settled: {new Date().toLocaleTimeString()}</span>
              </div>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4 pb-10">
        <div className="grid grid-cols-2 gap-4">
          <button className="py-4 glass rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-white/10 transition-all border border-white/5 active:scale-95">
            <Download size={18} /> SAVE PDF
          </button>
          <button className="py-4 glass rounded-2xl flex items-center justify-center gap-3 text-xs font-bold hover:bg-white/10 transition-all border border-white/5 active:scale-95">
            <Share2 size={18} /> SHARE
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-4 mt-6">
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 animate-[progress_8s_linear] shadow-[0_0_10px_#38bdf8]"></div>
             </div>
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Closing Bridge Node...</p>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
