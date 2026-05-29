import React, { useState, useEffect } from 'react';
import PosTab from './components/PosTab';
import ReportTab from './components/ReportTab';
import ManageTab from './components/ManageTab';
import PaymentTab from './components/PaymentTab'; // <-- Tambah gerbang integrasi Payment API
import CartSheet from './components/CartSheet';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Core Global Database States
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [historyTransactions, setHistoryTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State Input Form Manage Produk
  const [editingProduct, setEditingProduct] = useState(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Gorengan');
  const [formStock, setFormStock] = useState('');
  const [formVariants, setFormVariants] = useState('');
  const [formImage, setFormImage] = useState('');

  // Fetch Ambil Seluruh Data Produk
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products');
      const result = await response.json();
      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error("Gagal load produk:", error);
    }
  };

  // Fetch Ambil Seluruh Laporan Omset
  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/transactions');
      const result = await response.json();
      if (result.success) setHistoryTransactions(result.data);
    } catch (error) {
      console.error("Gagal load data laporan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (activeTab === 'report') fetchReportData();
  }, [activeTab]);

  // Efek Pemicu Thermal Printer
  useEffect(() => {
    if (receiptData !== null) {
      window.print();
      setCart([]);
      setShowCartSheet(false);
      setReceiptData(null);
      fetchProducts(); // Auto-refresh sisa stok gudang setelah cetak nota selesai
    }
  }, [receiptData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProductClick = (product) => {
    if (product.stock <= 0) {
      alert(`Stok ${product.name} Habis bro!`);
      return;
    }
    if (product.has_variants) {
      setSelectedProduct(product);
      setShowVariantModal(true);
    } else {
      addToCart(product, "-");
    }
  };

  const addToCart = (product, variantName) => {
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${variantName}`;
      const existingItem = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`Pembelian melebihi sisa stok (${product.stock} pcs)!`);
          return prevCart;
        }
        return prevCart.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, cartItemId, selectedVariant: variantName, quantity: 1 }];
    });
    setShowVariantModal(false);
    setSelectedProduct(null);
  };

  const updateQuantity = (cartItemId, amount) => {
    setCart((prevCart) => prevCart.map((item) => {
      if (item.cartItemId === cartItemId) {
        if (amount > 0 && item.quantity >= item.stock) {
          alert("Batas maksimal stok tercapai!");
          return item;
        }
        return { ...item, quantity: item.quantity + amount };
      }
      return item;
    }).filter((item) => item.quantity > 0));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const variantArray = formVariants ? formVariants.split(',').map(v => v.trim()) : [];
    const payload = {
      id: editingProduct?.id || null,
      name: formName,
      price: Math.round(Number(formPrice)),
      category: formCategory,
      stock: Math.round(Number(formStock)),
      has_variants: variantArray.length > 0,
      variants: variantArray,
      image: formImage || null
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        setEditingProduct(null);
        setFormName(''); setFormPrice(''); setFormStock(''); setFormVariants(''); setFormImage('');
        fetchProducts();
      }
    } catch (error) {
      alert("Gagal menyimpan produk.");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    const confirmDelete = window.confirm(`Hapus jajanan "${name}" secara permanen bro?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchProducts();
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    }
  };

  const startEditProduct = (p) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormCategory(p.category);
    setFormStock(p.stock);
    setFormVariants(p.variants ? p.variants.join(', ') : '');
    setFormImage(p.image || '');
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-[#F8FAFC] h-screen flex flex-col shadow-2xl relative overflow-hidden font-sans border-x border-slate-100 print:hidden text-slate-800">
        
        {/* VIEW ROUTING TAB SECARA DINAMIS & MODULAR */}
        {activeTab === 'pos' && (
          <PosTab 
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            handleProductClick={handleProductClick}
            totalItems={totalItems}
            totalPrice={totalPrice}
            setShowCartSheet={setShowCartSheet}
          />
        )}

        {activeTab === 'report' && (
          <ReportTab historyTransactions={historyTransactions} isLoading={isLoading} />
        )}

        {activeTab === 'manage' && (
          <ManageTab 
            products={products} editingProduct={editingProduct} setEditingProduct={setEditingProduct}
            formName={formName} setFormName={setFormName} formPrice={formPrice} setFormPrice={setFormPrice}
            formCategory={formCategory} setFormCategory={setFormCategory} formStock={formStock} setFormStock={setFormStock}
            formVariants={formVariants} setFormVariants={setFormVariants} formImage={formImage} setFormImage={setFormImage}
            handleImageChange={handleImageChange} handleSaveProduct={handleSaveProduct}
            handleDeleteProduct={handleDeleteProduct} startEditProduct={startEditProduct}
          />
        )}

        {/* INTEGRASI COMPONENT TAB PAYMENT BARU */}
        {activeTab === 'payment' && (
          <PaymentTab />
        )}

        {/* BOTTOM NAVIGATION FIXED BAR (UPGRADE TOTAL MENJADI 4 MENU DENGAN WIDTH 1/4) */}
        <nav className="absolute bottom-3 left-4 right-4 bg-slate-900/95 backdrop-blur-md rounded-2xl h-14 flex justify-around items-center z-30 shadow-xl border border-slate-800">
          <button onClick={() => setActiveTab('pos')} className={`flex flex-col items-center justify-center w-1/4 h-full transition-all ${activeTab === 'pos' ? 'text-amber-400 scale-105 font-black' : 'text-slate-400'}`}>
            <span className="text-base">🏪</span><span className="text-[9px] font-bold mt-0.5 tracking-wide">Kasir POS</span>
          </button>
          <button onClick={() => setActiveTab('report')} className={`flex flex-col items-center justify-center w-1/4 h-full transition-all ${activeTab === 'report' ? 'text-amber-400 scale-105 font-black' : 'text-slate-400'}`}>
            <span className="text-base">📊</span><span className="text-[9px] font-bold mt-0.5 tracking-wide">Omset</span>
          </button>
          <button onClick={() => setActiveTab('manage')} className={`flex flex-col items-center justify-center w-1/4 h-full transition-all ${activeTab === 'manage' ? 'text-amber-400 scale-105 font-black' : 'text-slate-400'}`}>
            <span className="text-base">📦</span><span className="text-[9px] font-bold mt-0.5 tracking-wide">Produk</span>
          </button>
          <button onClick={() => setActiveTab('payment')} className={`flex flex-col items-center justify-center w-1/4 h-full transition-all ${activeTab === 'payment' ? 'text-amber-400 scale-105 font-black' : 'text-slate-400'}`}>
            <span className="text-base">💳</span><span className="text-[9px] font-bold mt-0.5 tracking-wide">Payment</span>
          </button>
        </nav>

        {/* CART SHEET BOTTOM COMPONENT */}
        {showCartSheet && activeTab === 'pos' && (
          <CartSheet 
            cart={cart} updateQuantity={updateQuantity} totalPrice={totalPrice}
            totalItems={totalItems} setShowCartSheet={setShowCartSheet}
            onCheckoutSuccess={(data) => setReceiptData(data)}
          />
        )}

        {/* MODAL PILIH VARIAN RASA */}
        {showVariantModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center z-50">
            <div className="bg-white w-full p-6 rounded-t-3xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div><span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{selectedProduct?.category}</span><h3 className="text-sm font-black text-slate-900 mt-0.5">{selectedProduct?.name}</h3></div>
                <button onClick={() => setShowVariantModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1">✕</button>
              </div>
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                {selectedProduct?.variants?.map((variant, index) => (
                  <button key={index} onClick={() => addToCart(selectedProduct, variant)} className="w-full py-3.5 px-4 text-left border border-slate-100 bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-400 rounded-xl font-bold text-xs text-slate-700 transition-all flex justify-between items-center group active:scale-98"><span>🌶️ {variant}</span><span className="text-slate-300 group-hover:text-amber-500 transition-colors">➔</span></button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 🧾 LAYOUT STRUK PRINT THERMAL */}
      {receiptData && (
        <div className="hidden print:block fixed inset-0 bg-white p-4 text-black font-mono text-xs w-[58mm] mx-auto z-50">
          <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-2 mb-2">
            <h2 className="text-sm font-black tracking-tight">KEDAI CEMILAN</h2>
            <p className="text-[9px] text-slate-600">Pelayanan Sat-set Kuliner</p>
            <p className="text-[9px]">{receiptData.date}</p>
            <p className="text-[10px] font-bold">{receiptData.invoiceNo}</p>
            <p className="text-[9px] font-bold bg-slate-100 p-0.5">METODE: {receiptData.paymentMethod}</p>
          </div>
          <div className="space-y-2 border-b border-dashed border-gray-400 pb-2 mb-2">
            {receiptData.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-start text-[11px]">
                <div className="flex-1 pr-1">
                  <div>{item.name}</div>
                  <div className="text-[9px] text-slate-600">({item.selectedVariant})</div>
                  <div>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</div>
                </div>
                <div className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between font-black"><span>TOTAL:</span><span>Rp {receiptData.total.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between"><span>BAYAR:</span><span>Rp {receiptData.cash.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between font-black border-t border-dotted border-slate-300 pt-1"><span>KEMBALI:</span><span>Rp {receiptData.change.toLocaleString('id-ID')}</span></div>
          </div>
        </div>
      )}
    </>
  );
}