
import React from 'react';
import { ShieldCheck, Globe, CreditCard, Info } from 'lucide-react';
import { PaymentData } from '../types';
import { BRIDGE_FEE_PCT, GST_ON_FEE_PCT, FX_RATES } from '../constants';

interface PaymentPreviewProps {
  data: PaymentData;
  onProceed: () => void;
  onCancel: () => void;
}

export const PaymentPreview: React.FC<PaymentPreviewProps> = ({ data, onProceed, onCancel }) => {
  const fx = FX_RATES[data?.originalCurrency] || FX_RATES['USD'];
  const currencySymbol = fx?.symbol || '$';
  
  const bridgeFee = (data?.inrAmount || 0) * BRIDGE_FEE_PCT;
  const gst = bridgeFee * GST_ON_FEE_PCT;
  const finalInr = (data?.inrAmount || 0) + bridgeFee + gst;

  return (
    <div className="flex flex-col h-screen p-6 animate-in slide-in-from-right-10 duration-500 overflow-y-auto pb-20">
      <h2 className="text-xl font-bold tracking-tight mb-6">Payment Handshake</h2>

      {/* Merchant Overview */}
      <div className="glass rounded-[2rem] p-6 mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white">{data?.merchantName}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Globe size={12} className="text-sky-400" />
              {data?.country} • {data?.isNIPL ? 'Native UPI Path' : 'Universal Bridge'}
            </p>
          </div>
          <div className="px-2 py-1 bg-sky-500/10 border border-sky-500/30 rounded text-[10px] font-bold text-sky-400 uppercase">
            Active
          </div>
        </div>

        <div className="h-px bg-white/5 w-full"></div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Total Bill</p>
            <p className="text-3xl font-mono font-bold text-white">
              {currencySymbol}{data?.originalAmount?.toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-slate-400 mb-1">
            ≈ ₹{data?.inrAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Transparency Card */}
      <div className="relative group mb-8">
        <div className="absolute inset-0 bg-violet-500/20 blur-2xl rounded-3xl -z-10 group-hover:bg-violet-500/30 transition-all"></div>
        <div className="glass border-violet-500/30 rounded-[2rem] p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-violet-400" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-violet-300">Transparency breakdown</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Mid-market Rate (0% Markup)</span>
              <span className="font-mono text-white">1 {fx?.code || 'USD'} = {fx?.rate || 0} INR</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Bridge Fee (1.5%)</span>
              <span className="font-mono text-white">₹{bridgeFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">GST on Fee (18%)</span>
              <span className="font-mono text-white">₹{gst.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/5 w-full my-2"></div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-semibold text-white">Final Bank Deduction</span>
              <span className="text-xl font-bold text-sky-400">₹{finalInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 items-center">
             <Info size={14} className="text-emerald-400 shrink-0" />
             <p className="text-[10px] text-emerald-400/80 leading-tight">
                You're saving ~₹{(finalInr * 0.035).toFixed(2)} vs standard 3.5% bank international markups.
             </p>
          </div>
        </div>
      </div>

      {/* Payment Source */}
      <div className="glass-dark rounded-2xl p-4 flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">HDFC Bank • • 910</p>
            <p className="text-[10px] text-slate-500 uppercase">Primary Liquidity Node</p>
          </div>
        </div>
        <button className="text-[10px] text-sky-400 font-bold uppercase">Change</button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <button 
          onClick={onProceed}
          className="w-full py-5 bg-sky-500 text-slate-950 font-bold rounded-2xl text-lg shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Confirm Payment
        </button>
        <button 
          onClick={onCancel}
          className="w-full py-4 text-slate-400 font-medium hover:text-white transition-colors"
        >
          Cancel Request
        </button>
      </div>
    </div>
  );
};
