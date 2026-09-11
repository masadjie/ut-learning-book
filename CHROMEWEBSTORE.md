# Chrome Web Store Listing: UT Book Scanner By Adjie Kurniawan

## Metadata
- **Extension Name:** UT Book Scanner By Adjie Kurniawan
- **Author:** Adjie Kurniawan
- **Version:** 1.0.0
- **Primary Category:** Productivity / Education
- **Language:** Indonesian (id)
- **Last Updated:** 2026-09-11

## Short Description (max 132 chars)
Auto scan, extract, and export Universitas Terbuka Kotobee digital books into Word and LLM-ready prompts for AI study assistants.

## Detailed Description
UT Book Auto-Scanner & Exporter adalah ekstensi browser yang mempermudah mahasiswa dan akademisi dalam merangkum serta mengekstrak materi buku digital dari platform Universitas Terbuka (Kotobee Reader).

Fitur Unggulan:
- 📖 Auto-Scan & Auto-Next Otomatis: Otomatis membaca dan berpindah halaman secara teratur hingga bab/buku selesai.
- ⏱️ Jeda Waktu (Delay) Adaptif: Mengatur interval perpindahan halaman agar dokumen termuat dengan sempurna.
- 🧹 Ekstraksi Teks Bersih: Memisahkan judul bab, sub-bab, rumus, dan paragraf dengan rapi tanpa gangguan tombol navigasi antarmuka.
- 📄 Ekspor Dokumen Word (.doc): Dokumen rapi siap cetak atau dibaca offline lengkap dengan pemisah halaman (page breaks).
- 📝 Ekspor Markdown (.md): Format ringan yang sangat hemat token dan optimal untuk LLM.
- 🤖 1-Click Copy untuk Google Gemini / AI LLM: Menyertakan prompt instruksi asisten akademis otomatis untuk memudahkan diskusi dan perangkuman materi modul di Google AI Studio, Gemini, atau NotebookLM.

## Permissions Justification
- `storage`: Digunakan untuk menyimpan sementara bab/halaman buku yang telah discan dan konfigurasi jeda waktu pengguna.
- `tabs`: Digunakan untuk mendeteksi tab reader buku Kotobee yang sedang aktif dan mengirim instruksi navigasi/ekstraksi.
- `activeTab`: Digunakan untuk menjalankan aksi scan langsung pada tab pembaca buku yang dibuka pengguna.
- `scripting`: Digunakan untuk menyuntikkan scraper dan widget kontrol interaktif ke dalam reader buku.

## Host Permissions Justification
- `*://*.kotobee.com/*` & `*://univterbuka.kotobee.com/*`: Diperlukan secara spesifik hanya pada domain pembaca buku digital Universitas Terbuka Kotobee Reader untuk mengekstrak teks materi modul.
