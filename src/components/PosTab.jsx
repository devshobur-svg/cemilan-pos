import React from 'react';

export default function PosTab({ 
  products, 
  selectedCategory, 
  setSelectedCategory, 
  handleProductClick, 
  totalItems, 
  totalPrice, 
  setShowCartSheet 
}) {
  
  const filteredProducts = selectedCategory === 'Semua' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] h-full overflow-hidden">
      
      {/* HEADER: SEJAJAR, SEMI-TRANSPARAN DENGAN BLUR MODERN */}
      <header className="bg-[#0F172A]/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
            Cemilan POS <span className="text-orange-500 text-sm">🔥</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Premium Cashier</p>
        </div>
        
        {/* Tombol Keranjang: Posisi Center Balanced */}
        <button 
          onClick={() => setShowCartSheet(true)} 
          className="relative p-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl transition-all active:scale-90 border border-white/5 flex items-center justify-center"
        >
          <span className="text-base">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black shadow-md border border-[#0F172A]">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* PILLS KATEGORI: FLAT MINIMALIS */}
      <div className="bg-[#0F172A] px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none border-b border-white/5">
        {['Semua', 'Gorengan', 'Cemilan Kering', 'Minuman'].map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              selectedCategory === cat 
                ? 'bg-orange-500 text-white shadow-sm font-black' 
                : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID KULINER: UNIFIED DARK CANVAS */}
      <main className="flex-1 p-4 overflow-y-auto pb-32 bg-[#0F172A] scrollbar-none">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <button 
              key={product.id} 
              onClick={() => handleProductClick(product)} 
              className={`bg-slate-900/60 border border-white/5 p-2 rounded-2xl flex flex-col relative overflow-hidden active:scale-[0.97] transition-all group shadow-md ${
                product.stock <= 0 ? 'opacity-40' : 'hover:border-orange-500/20'
              }`}
            >
              {/* Badge Stok Minimalis Melayang Halus */}
              <span className={`absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wide z-10 shadow-sm backdrop-blur-md ${
                product.stock > 15 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : product.stock > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' : 'bg-rose-500/10 text-rose-400 border border-rose-500/10'
              }`}>
                {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
              </span>
              
              {/* Foto Produk dengan Cover Fit Termarginalkan */}
              <div className="w-full h-28 overflow-hidden rounded-xl bg-slate-800 relative mb-2">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1547058886-af77992d478c?w=150'} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                />
              </div>
              
              {/* Detail Teks Jajanan Ringkas & Padat */}
              <div className="px-1 text-left w-full space-y-0.5">
                <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase block">{product.category}</span>
                <h3 className="font-bold text-slate-200 text-xs truncate w-full group-hover:text-orange-400 transition-colors">{product.name}</h3>
                <p className="text-orange-400 font-extrabold text-xs pt-0.5">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* FLOATING ACTION CART BAR (LEBIH TIPIS & ELEGAN) */}
      {totalItems > 0 && (
        <div className="absolute bottom-20 left-0 right-0 px-4 z-20">
          <button 
            onClick={() => setShowCartSheet(true)} 
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 px-4 rounded-xl font-bold shadow-xl flex justify-between items-center transform active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="bg-slate-950/20 text-white px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase">
                {totalItems} Item
              </span>
              <span className="text-xs font-black">Lihat Nota</span>
            </div>
            <span className="text-xs font-black tracking-wide border-l border-white/20 pl-3">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}