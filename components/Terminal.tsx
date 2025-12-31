
import React, { useState, useCallback } from 'react';
import { ShieldCheck, Terminal as TerminalIcon, Check } from 'lucide-react';
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
    `> [BRIDGE] Handshake Initiated: Requesting pacs.008 ISO-20022 message...`,
    `> [CORE] Communicating with Global Correspondent Bank (Sponsor Node)...`,
    `> [FX] Mid-Market Rate conversion finalized: 1 ${data?.originalCurrency || 'USD'} = ${fx?.rate || 0} INR.`,
    `> [SETTLE] Dispatching funds via ${data?.isNIPL ? 'Native Rail' : 'Global BaaS Bridge'} (FedNow/SEPA/FPS)...`,
    `> [SUCCESS] Merchant Account Credited. Bridge Closed.`
  ];

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleClear = () => setPin('');

  const runTerminal = useCallback(async () => {
    setShowLogs(true);
    for (let i = 0; i < logMessages.length; i++) {
      setLogs(prev => [...prev, logMessages[i]]);
      await new Promise(r => setTimeout(r, 1200));
    }
    setTimeout(onComplete, 1000);
  }, [onComplete, logMessages]);

  const handleConfirm = () => {
    if (pin.length === 4) {
      setIsVerifying(true);
      setTimeout(runTerminal, 1500);
    }
  };

  if (showLogs) {
    return (
      <div className="flex flex-col h-screen bg-[#020617] p-6 font-mono overflow-hidden">
        <div className="flex items-center gap-2 mb-8">
          <TerminalIcon className="text-emerald-500 animate-pulse" size={18} />
          <h2 className="text-emerald-500 text-xs tracking-widest uppercase">Global Settle Terminal v4.0</h2>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-[11px] leading-relaxed text-emerald-400/90 animate-in fade-in slide-in-from-left-2 duration-700">
              {log}
            </div>
          ))}
          {logs.length < logMessages.length && (
            <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block mt-1"></div>
          )}
        </div>
        <div className="mt-auto pt-6 border-t border-emerald-500/10 text-[10px] text-emerald-900 uppercase">
          E2E Encrypted • Tunnel Active • Node-342
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4 mb-10 mt-8">
        <div className="w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <ShieldCheck size={32} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Secure PIN Entry</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">UPI Global Authentication</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-12">
        {/* PIN Display */}
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                pin.length > i 
                  ? 'border-sky-500 bg-sky-500/10' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {pin.length > i && <div className="w-3 h-3 rounded-full bg-white animate-in zoom-in duration-300"></div>}
            </div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'C') handleClear();
                else if (key === '⌫') setPin(prev => prev.slice(0, -1));
                else handleKeyPress(key);
              }}
              className="h-16 rounded-2xl glass hover:bg-white/10 active:scale-90 transition-all text-xl font-medium"
            >
              {key}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={pin.length < 4 || isVerifying}
          className="w-full py-5 bg-sky-500 text-slate-950 font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 transform hover:scale-105 active:scale-95 transition-all"
        >
          {isVerifying ? <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div> : <Check size={20} />}
          {isVerifying ? 'Verifying...' : 'Confirm Authentication'}
        </button>
      </div>
    </div>
  );
};
