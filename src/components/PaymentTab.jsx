import React, { useState } from 'react';

export default function PaymentTab() {
  const [gateways, setGateways] = useState([
    { id: 'gopay', name: 'GoPay / GoTo Financial', logo: '📱', isConnected: true, merchantId: 'G-8829102', type: 'Direct API / Midtrans' },
    { id: 'ovo', name: 'OVO (LiDo)', logo: '💜', isConnected: false, merchantId: '', type: 'Xendit Gateway' },
    { id: 'dana', name: 'DANA Indonesia', logo: '🔷', isConnected: false, merchantId: '', type: 'Direct API Integration' },
    { id: 'qris', name: 'QRIS Statis / Dinamis', logo: '📸', isConnected: true, merchantId: 'MID-992011', type: 'Automated QR Generator' },
  ]);

  const [selectedGateway, setSelectedGateway] = useState(null);
  const [apiKey, setApiKey] = useState('•••••••••••••••••••••••••');
  const [secretKey, setSecretKey] = useState('•••••••••••••••••••••••••');

  const toggleConnection = (id) => {
    setGateways(gateways.map(g => g.id === id ? { ...g, isConnected: !g.isConnected } : g));
  };

  return (
    <>
      <header className="bg-slate-950 p-5 pt-7 border-b border-white/5 sticky top-0 z-10 shadow-2xl">
        <h1 className="text-xl font-extrabold text-white tracking-tight">Gerbang Pembayaran 💳</h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Integrasi API E-Wallet & Payment Gateway</p>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-24 space-y-4 bg-slate-950">
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs text-amber-400 space-y-1 shadow-md">
          <p className="font-bold">💡 Mode Integrasi Sandbox/Production:</p>
          <p className="text-slate-300 leading-relaxed">
            Gunakan halaman ini untuk menghubungkan kredensial API dari merchant dashboard (GoBiz, Midtrans, atau Xendit) agar kasir bisa generate QRIS otomatis secara real-time.
          </p>
        </div>

        <div className="space-y-3">
          {gateways.map((g) => (
            <div key={g.id} className="bg-slate-900 p-4 rounded-2xl border border-white/5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-slate-950 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                    {g.logo}
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white">{g.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{g.type}</p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleConnection(g.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    g.isConnected ? 'bg-emerald-500 flex justify-end' : 'bg-slate-800 flex justify-start'
                  }`}
                >
                  <span className="bg-white w-4 h-4 rounded-full shadow-md block transition-transform"></span>
                </button>
              </div>

              {g.isConnected ? (
                <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                      API Terhubung ({g.merchantId || 'Active'})
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedGateway(g)}
                    className="text-[10px] font-black text-slate-300 bg-slate-800 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all border border-white/5"
                  >
                    ⚙️ Konfigurasi
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 font-medium">
                  🔴 API Belum terkonfigurasi. Klik toggle untuk mengaktifkan.
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedGateway && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center z-50 animate-fade-in">
            <div className="bg-slate-900 border-t border-white/10 w-full p-6 rounded-t-3xl shadow-2xl space-y-4 max-w-md text-white">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Kredensial API</span>
                  <h3 className="text-sm font-black text-white mt-0.5">Setup {selectedGateway.name}</h3>
                </div>
                <button onClick={() => setSelectedGateway(null)} className="text-slate-400 hover:text-white font-bold text-sm p-1">✕</button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Merchant ID / Client ID</label>
                  <input type="text" defaultValue={selectedGateway.merchantId || 'M-' + Math.floor(Math.random() * 100000)} className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-bold focus:outline-none text-white focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Public API Key</label>
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono focus:outline-none text-white focus:border-amber-500 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Secret Key Token</label>
                  <input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono focus:outline-none text-white focus:border-amber-500 transition-all" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      alert(`API Kredensial ${selectedGateway.name} berhasil disimpan!`);
                      setSelectedGateway(null);
                    }}
                    className="w-full bg-amber-500 text-slate-950 text-xs font-black py-3 rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    Simpan & Tes Koneksi API
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}