import React from 'react';

export default function ManageTab({
  products,
  editingProduct,
  setEditingProduct,
  formName, setFormName,
  formPrice, setFormPrice,
  formCategory, setFormCategory,
  formStock, setFormStock,
  formVariants, setFormVariants,
  formImage, setFormImage,
  handleImageChange,
  handleSaveProduct,
  handleDeleteProduct,
  startEditProduct
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] h-full overflow-hidden text-slate-100">
      
      {/* HEADER MANAGE STOK DARK */}
      <header className="bg-[#0F172A]/90 backdrop-blur-md p-5 pt-6 pb-4 border-b border-white/5 sticky top-0 z-10">
        <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
          Manajemen Produk <span className="text-slate-400 text-sm">📦</span>
        </h1>
        <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Atur Sisa Stock Checking Berkala</p>
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-32 space-y-5 scrollbar-none">
        
        {/* FORM INPUT PREMIUM DARK MODAL STYLE */}
        <form onSubmit={handleSaveProduct} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest block">
            {editingProduct ? '📝 MODE EDIT JAJANAN' : '✨ TAMBAH JAJANAN BARU'}
          </h3>
          
          <div className="space-y-3">
            {/* Input Nama */}
            <input 
              type="text" 
              placeholder="Nama Jajanan Kuliner" 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)} 
              required 
              className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all shadow-inner"
            />
            
            {/* Upload File Galeri Container */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                Foto Jajanan (Pilih dari Galeri)
              </label>
              <div className="flex items-center gap-3 bg-slate-950/60 border border-white/10 p-2 rounded-xl shadow-inner">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-orange-500 file:text-white file:cursor-pointer active:scale-95 transition-all"
                />
                {formImage && (
                  <img src={formImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg bg-slate-800 border border-white/10 shadow-md" />
                )}
              </div>
            </div>

            {/* Grid Harga & Stok */}
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                placeholder="Harga Jual (Rp)" 
                value={formPrice} 
                onChange={(e) => setFormPrice(e.target.value)} 
                required 
                className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all shadow-inner"
              />
              <input 
                type="number" 
                placeholder="Batas Stok" 
                value={formStock} 
                onChange={(e) => setFormStock(e.target.value)} 
                required 
                className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all shadow-inner"
              />
            </div>

            {/* Dropdown Kategori */}
            <select 
              value={formCategory} 
              onChange={(e) => setFormCategory(e.target.value)} 
              className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-slate-300 focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all"
            >
              <option value="Gorengan" className="bg-slate-900 text-white">Kategori: Gorengan</option>
              <option value="Cemilan Kering" className="bg-slate-900 text-white">Kategori: Cemilan Kering</option>
              <option value="Minuman" className="bg-slate-900 text-white">Kategori: Minuman</option>
            </select>

            {/* Input Varian */}
            <input 
              type="text" 
              placeholder="Varian Rasa (Pisah koma, Cth: Original, Pedas)" 
              value={formVariants} 
              onChange={(e) => setFormVariants(e.target.value)} 
              className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-950 transition-all shadow-inner"
            />
          </div>

          {/* Buttons Group */}
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-98 transition-all">
              Simpan Jajanan
            </button>
            {editingProduct && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingProduct(null);
                  setFormName(''); setFormPrice(''); setFormStock(''); setFormVariants(''); setFormImage('');
                }} 
                className="px-4 bg-slate-800 text-slate-400 py-3 rounded-xl font-bold text-xs active:scale-98 transition-all border border-white/5"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        <h3 className="text-[10px] font-black text-slate-500 tracking-widest uppercase pt-2">Daftar Gudang Stok</h3>

        {/* LIST STOK PRODUK UNIFIED STYLE */}
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="bg-slate-900/40 border border-white/5 p-3 rounded-xl flex justify-between items-center gap-3 shadow-sm">
              <div className="min-w-0 flex-1 flex gap-3 items-center">
                <img src={p.image || 'https://images.unsplash.com/photo-1547058886-af77992d478c?w=150'} alt="" className="w-10 h-10 object-cover rounded-xl bg-slate-800 border border-white/5" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{p.name}</h4>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">Rp {p.price.toLocaleString('id-ID')} • {p.category}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 15 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                    <span className={`text-[11px] font-bold ${p.stock > 15 ? 'text-emerald-400' : p.stock > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      Sisa Gudang: {p.stock} pcs
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1.5">
                <button onClick={() => startEditProduct(p)} className="text-[11px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg active:scale-95 transition-all hover:bg-orange-500/20">
                  Adjust
                </button>
                <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-[11px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all hover:bg-rose-500/20">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}