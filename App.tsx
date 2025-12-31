
import React, { useState, useCallback } from 'react';
import { AppMode, PaymentData, Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { PaymentPreview } from './components/PaymentPreview';
import { Terminal } from './components/Terminal';
import { SuccessReceipt } from './components/SuccessReceipt';
import { parseReceipt } from './geminiService';
import { INITIAL_BALANCE, BRIDGE_FEE_PCT, GST_ON_FEE_PCT } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      merchant: 'Starbucks Times Square',
      amount: 4.50,
      currency: 'USD',
      inrValue: 404.82,
      date: 'Dec 29, 2025',
      status: 'SUCCESS'
    },
    {
      id: '2',
      merchant: 'Louver Museum Paris',
      amount: 22.00,
      currency: 'EUR',
      inrValue: 2310.00,
      date: 'Dec 28, 2025',
      status: 'SUCCESS'
    }
  ]);
  const [currentPayment, setCurrentPayment] = useState<PaymentData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (file: File) => {
    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await parseReceipt(base64);
        setCurrentPayment(data);
        setMode(AppMode.PAYMENT_PREVIEW);
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Scan error", err);
      setIsScanning(false);
      // Fallback mockup if API fails for demo
      const mock: PaymentData = {
        merchantName: "Global Merchant",
        country: "UAE",
        originalCurrency: "AED",
        originalAmount: 150.00,
        subtotal: 150.00,
        tax: 0,
        inrAmount: 3675.00,
        isNIPL: true
      };
      setCurrentPayment(mock);
      setMode(AppMode.PAYMENT_PREVIEW);
    }
  };

  const finalizePayment = useCallback(() => {
    if (!currentPayment) return;
    
    const fee = currentPayment.inrAmount * BRIDGE_FEE_PCT;
    const gst = fee * GST_ON_FEE_PCT;
    const totalDeduction = currentPayment.inrAmount + fee + gst;

    setBalance(prev => prev - totalDeduction);
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      merchant: currentPayment.merchantName,
      amount: currentPayment.originalAmount,
      currency: currentPayment.originalCurrency,
      inrValue: totalDeduction,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'SUCCESS'
    };
    
    setTransactions(prev => [newTx, ...prev]);
    setMode(AppMode.SUCCESS);
  }, [currentPayment]);

  return (
    <div className="min-h-screen flex justify-center bg-[#020617]">
      <div className="w-full max-w-md bg-[#020617] relative shadow-2xl overflow-x-hidden min-h-screen">
        {mode === AppMode.DASHBOARD && (
          <Dashboard 
            balance={balance} 
            transactions={transactions} 
            onScanClick={() => setMode(AppMode.SCAN)} 
          />
        )}

        {mode === AppMode.SCAN && (
          <Scanner 
            onScan={handleScan} 
            onCancel={() => setMode(AppMode.DASHBOARD)} 
            isLoading={isScanning}
          />
        )}

        {mode === AppMode.PAYMENT_PREVIEW && currentPayment && (
          <PaymentPreview 
            data={currentPayment} 
            onProceed={() => setMode(AppMode.BAAS_TERMINAL)}
            onCancel={() => setMode(AppMode.DASHBOARD)}
          />
        )}

        {mode === AppMode.BAAS_TERMINAL && currentPayment && (
          <Terminal 
            data={currentPayment} 
            onComplete={finalizePayment} 
          />
        )}

        {mode === AppMode.SUCCESS && currentPayment && (
          <SuccessReceipt 
            data={currentPayment} 
            onDone={() => setMode(AppMode.DASHBOARD)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
