import React, { useState, useCallback, useEffect } from 'react';
/* Added Loader2 to imports to resolve the 'Cannot find name Loader2' error on line 130 */
import { ShieldCheck, Terminal as TerminalIcon, Check, Lock, Loader2 } from 'lucide-react';
import { PaymentData } from '../types';
import { FX_RATES } from '../constants';

interface TerminalProps {
  data: PaymentData;
  onComplete: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ data, onComplete }) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const fx = FX_RATES[data?.originalCurrency || 'USD'] || FX_RATES['USD'];

  const logMessages = [
    `> [AUTH] UPI PIN verified by issuer node...`,
    `> [ISO] Constructing pacs.008.001.09 message...`,
    `> [CORE] Communicating with Global Correspondent (SWIFT-G)...`,
    `> [FX] Final Rate: 1 ${data?.originalCurrency || 'USD'} = ${fx?.rate || 0} INR.`,
    `> [SETTLE] Dispatching via ${data?.isNIPL ? 'Native NIPL Rail' : 'BaaS Global Bridge'}...`,
    `> [NETWORK] Confirmation received from ${data?.merchantName.split(' ')[0]}...`,
    `> [STABLE] Transaction Finalized. Bridge Sealed.`
  ];

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const runTerminal = useCallback(async () => {
    setShowLogs(true);
    for (const msg of logMessages) {
      setLogs(prev => [...prev, msg]);
      await new Promise(r => setTimeout(r, 700));
    }
    setTimeout(onComplete, 800);
  }, [onComplete]);

  const handleConfirm = () => {
    if (pin.length === 4) {
      setIsVerifying(true);
      setTimeout(runTerminal, 1000);
    }
  };

  if (showLogs) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 p-8 font-mono overflow-hidden animate-in fade-in duration-700">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
          <TerminalIcon className="text-emerald-400 animate-pulse" size={20} />
          <div>
            <h2 className="text-emerald-400 text-[10px] tracking-[0.3em] font-black uppercase">Global Orchestration Terminal</h2>
            <p className="text-[8px] text-slate-600 font-mono mt-1 uppercase tracking-widest">Version: 2025.04.1.STABLE</p>
          </div>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-[11px] leading-relaxed text-emerald-400/90 animate-in fade-in slide-in-from-left-4 duration-500 font-medium">
              {log}
            </div>
          ))}
          {logs.length < logMessages.length && (
            <div className="w-2 h-4 bg-emerald-500/60 animate-pulse inline-block mt-1"></div>
          )}
        </div>
        <div className="mt-auto pt-8 border-t border-emerald-500/10 text-[9px] text-emerald-900 font-black uppercase tracking-[0.4em] flex justify-between">
          <span>Tunnel: Node-342</span>
          <span>Quantum Sealed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-8 animate-in fade-in slide-in-from-right-10 duration-700 bg-slate-950/40 backdrop-blur-3xl">
      <div className="flex flex-col items-center gap-6 mb-12 mt-10">
        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-3xl -z-10 animate-pulse"></div>
          <div className="w-20 h-20 rounded-[2.2rem] bg-slate-900 border border-white/10 flex items-center justify-center text-sky-400 shadow-2xl">
            <Lock size={36} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Enter UPI PIN</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em] mt-2">Authorization required</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-14">
        <div className="flex gap-5">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-14 h-20 rounded-[1.25rem] border-2 flex items-center justify-center transition-all duration-500 shadow-inner ${
                pin.length > i 
                  ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.2)]' 
                  : 'border-white/5 bg-white/5'
              }`}
            >
              {pin.length > i && <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white] animate-in zoom-in duration-300"></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5 w-full max-w-[320px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'C') setPin('');
                else if (key === '⌫') setPin(prev => prev.slice(0, -1));
                else handleKeyPress(key);
              }}
              className="h-16 rounded-2xl glass hover:bg-white/10 active:scale-90 transition-all text-2xl font-bold font-mono tracking-tighter"
            >
              {key}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={pin.length < 4 || isVerifying}
          className="btn-premium w-full py-5 bg-sky-500 text-slate-950 font-black rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:scale-100 mt-auto mb-6"
        >
          {isVerifying ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Check size={24} strokeWidth={3} />
              AUTHORIZE
            </>
          )}
        </button>
      </div>
    </div>
  );
};
