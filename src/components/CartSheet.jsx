import React, { useState } from 'react';
import PaymentSelector from './PaymentSelector';

export default function CartSheet({ cart, updateQuantity, totalPrice, totalItems, setShowCartSheet, onCheckoutSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [cashReceived, setCashReceived] = useState('');

  const change = cashReceived ? parseFloat(cashReceived) - totalPrice : 0;
  
  const isButtonDisabled = () => {
    if (totalPrice === 0) return true;
    if (paymentMethod === 'CASH' && (change < 0 || !cashReceived)) return true;
    return false;
  };

  const handleProcessCheckout = async () => {
    const generatedInvoice = `INV-${Date.now().toString().slice(-6)}`;
    
    const transactionPayload = {
      invoice_no: generatedInvoice,
      total_price: Math.round(Number(totalPrice)),
      payment_method: paymentMethod,
      cash_received: paymentMethod === 'CASH' ? Math.round(Number(cashReceived)) : Math.round(Number(totalPrice)),
      cash_change: paymentMethod === 'CASH' ? Math.round(Number(change)) : 0,
      items: cart.map(item => ({
        name: item.name,
        selectedVariant: item.selectedVariant,
        price: Math.round(Number(item.price)),
        quantity: Math.round(Number(item.quantity))
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });

      const result = await response.json();

      if (response.status === 400) {
        alert(result.message);
        return;
      }

      if (result.success) {
        onCheckoutSuccess({
          invoiceNo: generatedInvoice,
          date: new Date().toLocaleString('id-ID'),
          items: [...cart],
          total: totalPrice,
          cash: transactionPayload.cash_received,
          change: transactionPayload.cash_change,
          paymentMethod: paymentMethod
        });
      }
    } catch (error) {
      alert("Gagal terhubung ke server backend!");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center z-40">
      <div className="bg-slate-900 w-full h-[85vh] rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden max-w-md border-t border-white/10 text-slate-100">
        
        {/* Header Title Sheet */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
          <div>
            <h2 className="text-base font-extrabold text-white">Isi Nota Belanja</h2>
            <p className="text-xs text-slate-400 font-medium">{totalItems} pcs cemilan siap dibungkus</p>
          </div>
          <button onClick={() => setShowCartSheet(false)} className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center font-bold text-xs transition-all">✕</button>
        </div>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-950">
          {cart.map((item) => (
            <div key={item.cartItemId} className="flex justify-between items-center bg-slate-900 p-3 rounded-2xl border border-white/5">
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-xs font-bold text-slate-200 truncate">{item.name}</h4>
                <span className="inline-block text-[9px] bg-amber-500/10 text-amber-400 font-extrabold px-2 py-0.5 rounded-md mt-0.5 border border-amber-500/20">{item.selectedVariant}</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-950 p-1 rounded-xl border border-white/5">
                <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-6 h-6 bg-slate-900 text-slate-300 rounded-lg flex items-center justify-center font-black text-xs active:bg-slate-800">-</button>
                <span className="text-xs font-black w-4 text-center text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-6 h-6 bg-slate-900 text-slate-300 rounded-lg flex items-center justify-center font-black text-xs active:bg-slate-800">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="p-5 border-t border-white/5 bg-slate-900 space-y-3.5">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Total Tagihan Nota:</span>
            <span className="text-amber-400 text-lg font-black">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          
          <PaymentSelector 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            change={change}
            totalPrice={totalPrice}
          />
          
          <button 
            disabled={isButtonDisabled()} 
            onClick={handleProcessCheckout} 
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 font-black rounded-xl shadow-lg text-xs tracking-wider uppercase active:scale-[0.99] transition-all"
          >
            Konfirmasi & Cetak Struk ({paymentMethod})
          </button>
        </div>

      </div>
    </div>
  );
}