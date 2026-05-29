import React from 'react';

export default function PaymentSelector({ 
  paymentMethod, 
  setPaymentMethod, 
  cashReceived, 
  setCashReceived, 
  change, 
  totalPrice 
}) {
  return (
    <div className="space-y-4 border-t border-slate-800 pt-4 mt-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
        Metode Pembayaran Premium
      </label>
      
      {/* Tab Selector Mode */}
      <div className="grid grid-cols-3 gap-2">
        {['CASH', 'TRANSFER', 'QRIS'].map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => {
              setPaymentMethod(method);
              setCashReceived('');
            }}
            className={`py-3 rounded-xl text-xs font-black transition-all active:scale-95 border ${
              paymentMethod === method 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                : 'bg-slate-900 text-slate-400 border-white/5 hover:bg-slate-800'
            }`}
          >
            {method === 'CASH' ? '💵 Cash' : method === 'TRANSFER' ? '🏦 Bank' : '📱 QRIS'}
          </button>
        ))}
      </div>

      {/* Konten Input Dinamis */}
      {paymentMethod === 'CASH' && (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Uang Bayar Tunai</label>
            <input 
              type="number" 
              value={cashReceived} 
              onChange={(e) => setCashReceived(e.target.value)} 
              placeholder="Contoh: 50000" 
              className="w-full px-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-black text-white focus:outline-none focus:border-amber-500 transition-all shadow-inner" 
            />
          </div>
          {cashReceived && (
            <div className="flex justify-between items-center text-xs font-bold bg-slate-900 p-3 rounded-xl border border-white/5 shadow-md">
              <span className="text-slate-400 font-semibold">Kembalian Kas:</span>
              <span className={`font-black text-sm ${change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {change >= 0 ? `Rp ${change.toLocaleString('id-ID')}` : 'Uang Kurang!'}
              </span>
            </div>
          )}
        </div>
      )}

      {paymentMethod === 'TRANSFER' && (
        <div className="p-3.5 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-2 text-xs text-blue-300">
          <p className="font-extrabold text-[10px] text-blue-400 uppercase tracking-wider">Rekening Bank Kedai</p>
          <div className="font-mono font-bold text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-white/5 flex justify-between items-center shadow-inner">
            <span>BCA: 123-456-7890</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-lg font-sans font-black">a.n Shobur</span>
          </div>
        </div>
      )}

      {paymentMethod === 'QRIS' && (
        <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex flex-col items-center gap-2 text-xs text-purple-300">
          <p className="font-extrabold text-[10px] text-purple-400 uppercase tracking-wider w-full text-left">Pindai QRIS Monitor</p>
          <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl border border-purple-500/20">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KedaiCemilanShobur" 
              alt="QRIS Toko" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}