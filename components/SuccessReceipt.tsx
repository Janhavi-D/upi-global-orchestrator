
import React, { useEffect } from 'react';
import { Check, Download, Share2, Globe, Clock } from 'lucide-react';
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
    const timer = setTimeout(onDone, 6000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-col h-screen p-6 animate-in fade-in zoom-in duration-700">
      <div className="flex flex-col items-center gap-4 my-10">
        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-bounce">
          <Check size={40} strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-emerald-400">Payment Successful</h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
      </div>

      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col gap-6">
        {/* Decorative cutouts for receipt feel */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-950 border border-white/10"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-950 border border-white/10"></div>
        
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">To Merchant</p>
            <p className="text-lg font-bold text-white leading-tight">{data?.merchantName || 'Merchant'}</p>
            <p className="text-xs text-slate-400">{data?.country || 'Unknown Location'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Status</p>
            <p className="text-xs font-bold text-emerald-400 uppercase">Settled</p>
          </div>
        </div>

        <div className="h-px border-t border-dashed border-white/10 w-full"></div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Original Amount</span>
            <span className="text-sm font-mono font-medium text-white">{currencySymbol}{data?.originalAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Conversion Rate</span>
            <span className="text-xs font-mono text-white">1 {fx?.code || 'USD'} = ₹{fx?.rate || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Bridge & Tax Fees</span>
            <span className="text-xs font-mono text-white">₹{(bridgeFee + gst).toFixed(2)}</span>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white">Total Deducted</span>
            <span className="text-xl font-bold text-sky-400">₹{finalInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Globe size={12} />
                <span>NIPL Partner Network Authorization Secured</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Clock size={12} />
                <span>Timestamp: {new Date().toLocaleString()}</span>
            </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4 pb-10">
        <button className="py-4 glass rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-white/10 transition-colors">
          <Download size={16} /> Save Receipt
        </button>
        <button className="py-4 glass rounded-2xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-white/10 transition-colors">
          <Share2 size={16} /> Share
        </button>
        <div className="col-span-2 flex flex-col items-center gap-2 mt-4">
             <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 animate-[progress_6s_linear]"></div>
             </div>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest">Redirecting to Dashboard...</p>
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
