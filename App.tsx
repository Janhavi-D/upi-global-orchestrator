
import React, { useState, useCallback } from 'react';
import { AppMode, PaymentData, Transaction } from './types';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { PaymentPreview } from './components/PaymentPreview';
import { Terminal } from './components/Terminal';
import { SuccessReceipt } from './components/SuccessReceipt';
import { parseReceipt } from './geminiService';
import { INITIAL_BALANCE, BRIDGE_FEE_PCT, GST_ON_FEE_PCT } from './constants';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200; // Slightly higher quality for Gemini 3
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("Canvas context failure");
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl.split(',')[1]);
      };
      img.onerror = () => reject("Image loading failed");
    };
    reader.onerror = () => reject("File reading failed");
  });
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [scanError, setScanError] = useState<string | null>(null);
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
    setScanError(null);
    try {
      const optimizedBase64 = await compressImage(file);
      const data = await parseReceipt(optimizedBase64);
      
      // Only proceed if scanning was successful
      setCurrentPayment(data);
      setMode(AppMode.PAYMENT_PREVIEW);
    } catch (err: any) {
      console.error("Scan error encountered:", err);
      // Ensure we stay in SCAN mode but show the error
      setScanError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsScanning(false);
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

  const resetToDashboard = () => {
    setScanError(null);
    setCurrentPayment(null);
    setMode(AppMode.DASHBOARD);
  };

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
            onCancel={resetToDashboard} 
            isLoading={isScanning}
            error={scanError}
          />
        )}

        {mode === AppMode.PAYMENT_PREVIEW && currentPayment && (
          <PaymentPreview 
            data={currentPayment} 
            onProceed={() => setMode(AppMode.BAAS_TERMINAL)}
            onCancel={resetToDashboard}
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
            onDone={resetToDashboard} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
