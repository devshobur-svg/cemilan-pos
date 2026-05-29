import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- Perbaikan import eksplisit untuk Vite

export default function ReportTab({ historyTransactions, isLoading }) {
  // Hitung akumulasi total omset dari seluruh transaksi yang sukses
  const totalOmset = historyTransactions.reduce((sum, t) => sum + t.total_price, 0);

  // FUNGSI POWERFUL GENERATE PDF & AUTO SHARE MULTI-PLATFORM
  const exportToPDFWithShare = async () => {
    if (historyTransactions.length === 0) {
      alert("Belum ada data transaksi untuk diexport bro!");
      return;
    }

    try {
      // 1. Inisialisasi Dokumen jsPDF (Format A4 Standar)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 2. Setup Desain & Typography Header PDF (Formal Clean Style)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // Warna Slate Gelap
      doc.text("LAPORAN OMSET KEDAI CEMILAN", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Warna Grey text
      doc.text(`Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`, 14, 26);
      doc.text("Sistem Manajemen Finansial POS Otomatis", 14, 31);

      // Garis Pembatas Header
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 35, 196, 35);

      // 3. Ringkasan Finansial Card di PDF
      doc.setFillColor(248, 250, 252); // Latar abu terang
      doc.roundedRect(14, 40, 182, 22, 3, 3, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("TOTAL PENDAPATAN BERSIH", 20, 47);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(234, 88, 12); // Warna Orange-Amber
      doc.text(`Rp ${totalOmset.toLocaleString('id-ID')}`, 20, 56);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`${historyTransactions.length} Nota Keluar`, 150, 52);

      // 4. Transformasi Data State ke Format Tabel jsPDF
      const tableRows = [];
      historyTransactions.forEach((tx) => {
        const itemDetails = tx.items?.map(item => 
          `${item.product_name} (${item.variant_name}) x${item.quantity}`
        ).join("\n") || "-";

        tableRows.push([
          tx.invoice_no,
          new Date(tx.created_at).toLocaleTimeString('id-ID'),
          itemDetails,
          tx.payment_method || 'CASH',
          `Rp ${tx.total_price.toLocaleString('id-ID')}`
        ]);
      });

      // 5. FIX PERBAIKAN: Memanggil fungsi autoTable secara direct dengan mengumpan objek doc
      autoTable(doc, {
        startY: 68,
        head: [['No. Invoice', 'Waktu', 'Rincian Jajanan', 'Metode', 'Total Tagihan']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 20 },
          2: { cellWidth: 80 },
          3: { cellWidth: 24 },
          4: { cellWidth: 30, halign: 'right' }
        },
        styles: { overflow: 'linebreak', cellPadding: 3 }
      });

      // 6. PROSES SHARE KE MULTI-PLATFORM / DOWNLOAD SHORTCUT
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `Laporan_Omset_${Date.now()}.pdf`, { type: 'application/pdf' });

      // Cek Web Share API
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: 'Laporan Omset Cemilan POS',
          text: 'Berikut lampiran rekap finansial omset masuk terbaru dari aplikasi kasir.'
        });
      } else {
        doc.save(`Laporan_Omset_${Date.now()}.pdf`);
        alert("PDF Berhasil di-download langsung ke MacBook lo bro!");
      }

    } catch (error) {
      console.error("Gagal export share pdf:", error);
      alert("Terjadi kendala saat memproses dokumen laporan.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0F172A] h-full overflow-hidden text-slate-100">
      
      {/* HEADER LAPORAN OMSET */}
      <header className="bg-[#0F172A]/90 backdrop-blur-md p-5 pt-6 pb-4 border-b border-white/5 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            Laporan Omset <span className="text-slate-400 text-sm">📊</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Monitor total pendapatan real-time</p>
        </div>

        {/* BUTTON ACTION EXPORT PDF */}
        {!isLoading && historyTransactions.length > 0 && (
          <button 
            onClick={exportToPDFWithShare}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-orange-500/10 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>📥</span> Export PDF
          </button>
        )}
      </header>

      <main className="flex-1 p-4 overflow-y-auto pb-32 space-y-4 scrollbar-none">
        
        {/* CARD RINGKASAN OMSET */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl text-white shadow-xl relative overflow-hidden border border-white/5">
          <div className="absolute -right-8 -bottom-8 text-8xl opacity-10">💰</div>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Total Pendapatan Bersih</p>
          <h2 className="text-2xl font-black mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
            Rp {totalOmset.toLocaleString('id-ID')}
          </h2>
          <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/5 text-xs text-slate-300">
            <span>Transaksi Berhasil:</span>
            <span className="font-bold bg-white/10 px-3 py-1 rounded-full text-amber-400 text-[11px]">
              {historyTransactions.length} Nota Keluar
            </span>
          </div>
        </div>

        <h3 className="font-extrabold text-xs text-slate-500 tracking-widest uppercase pt-2">Riwayat Transaksi</h3>

        {/* LIST DAFTAR NOTA */}
        {isLoading ? (
          <div className="text-center text-xs font-semibold text-slate-500 py-12 bg-slate-900/40 rounded-2xl border border-white/5">
            Memuat data omset...
          </div>
        ) : historyTransactions.length === 0 ? (
          <div className="text-center text-xs font-semibold text-slate-500 py-12 bg-slate-900/40 rounded-2xl border border-white/5">
            Belum ada pesanan masuk harian.
          </div>
        ) : (
          <div className="space-y-3">
            {historyTransactions.map((tx) => (
              <div key={tx.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl shadow-md space-y-2.5">
                
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-lg">
                    {tx.invoice_no}
                  </span>
                  <span className="text-slate-500 font-medium text-[10px]">
                    {new Date(tx.created_at).toLocaleTimeString('id-ID')}
                  </span>
                </div>
                
                <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl divide-y divide-white/5 border border-white/5">
                  {tx.items?.map((item) => (
                    <div key={item.id} className="py-1.5 flex justify-between items-center first:pt-0 last:pb-0">
                      <span className="font-medium text-slate-300">
                        {item.product_name} <span className="text-[10px] text-orange-400 bg-orange-500/10 px-1 py-0.2 rounded font-bold">({item.variant_name})</span> <span className="text-slate-500 font-black ml-1">x{item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-200">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs pt-0.5">
                  <span className="text-slate-500 font-medium">Metode & Tagihan:</span>
                  <span className="font-black text-slate-300 text-xs">
                    <span className={`px-2 py-0.5 rounded-md mr-1.5 font-sans tracking-wide text-[9px] font-black uppercase ${
                      tx.payment_method === 'QRIS' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : tx.payment_method === 'TRANSFER' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {tx.payment_method || 'CASH'}
                    </span>
                    • <span className="text-sm text-orange-400 ml-1">Rp {tx.total_price.toLocaleString('id-ID')}</span>
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}