# 📖 UT Book Scanner

<p align="center">
  <img src="icons/icon-128.png" width="96" height="96" alt="UT Book Scanner Logo" style="border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
</p>

<p align="center">
  <b>Automated High-Resolution Page Capture & Document Exporter</b><br>
  <b>for Universitas Terbuka (Kotobee Reader)</b><br>
  <sub>Dirancang & Dikembangkan oleh <b>Adjie Kurniawan</b></sub>
</p>

<p align="center">
  <a href="https://github.com/masadjie/ut-learning-book/releases/tag/v1.1.0"><img src="https://img.shields.io/badge/release-v1.1.0-blue.svg?style=for-the-badge&logo=github" alt="Release v1.1.0" /></a>
  <img src="https://img.shields.io/badge/Manifest-V3-success.svg?style=for-the-badge&logo=googlechrome" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Smart%20OCR-Enabled-emerald.svg?style=for-the-badge&logo=google" alt="Smart OCR Enabled" />
  <img src="https://img.shields.io/badge/Platform-Chrome%20Extension-orange.svg?style=for-the-badge&logo=googlechrome" alt="Platform" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-purple.svg?style=for-the-badge" alt="License" /></a>
</p>

---

## 📌 Sekilas Tentang Proyek

Membaca modul digital pada platform Ruang Baca Virtual (RBV) Universitas Terbuka yang berbasis **Kotobee Reader** sering kali membutuhkan akses dokumen offline dan ekstraksi teks yang bersih untuk kebutuhan belajar mandiri, merangkum materi kuliah, atau membuat arsip rujukan tugas.

**UT Book Scanner** adalah ekstensi browser Google Chrome (*Manifest V3*) modern yang mengotomatisasi proses pengarsipan halaman modul digital secara presisi, beresolusi tinggi, dan dilengkapi **Smart OCR Engine** untuk mengekstraksi teks terstruktur langsung ke format **Microsoft Word (.docx A4 Landscape + Teks)**, **Markdown (.md)**, serta **PDF (Print Layout Ready)**.

Teks dan dokumen hasil ekspor dirancang rapi dan berstandar OpenXML / Markdown terstruktur sehingga sangat ideal untuk langsung diunggah sebagai bahan sumber (*knowledge source*) atau disalin 1-klik ke ekosistem **Google LLM (Google NotebookLM, Gemini Pro, & Claude / ChatGPT)** untuk asistensi belajar cerdas berbasis AI.

---

## 🎛️ Dua Menu Utama (Dual Mode)

Ekstensi ini kini dilengkapi sakelar navigasi ganda yang fleksibel:

```
┌─────────────────────────────────────────────────────────────┐
│  [ 📸 Scan Pages ]          │      [ 📝 Pages to OCR ]      │
└─────────────────────────────────────────────────────────────┘
```

1. **📸 Scan Pages (Auto-Scan HD & Dokumen Word):**
   - Menangkap seluruh area modul secara visual beresolusi tinggi (*HD Landscape*).
   - Memotong (*cropping*) toolbar & navbar reader secara presisi.
   - Ekspor langsung ke file **Word (.docx A4 Landscape)** & **PDF Cetak**.
   - Dilengkapi pengaturan batas halaman otomatis (5, 10, 15, 25, 50, atau manual/kustom) dan slider jeda kecepatan.

2. **📝 Pages to OCR (Smart OCR Mode & LLM Prompt Ready):**
   - Mengekstrak teks dokumen modul secara instan dan berurutan dari struktur reader DOM & Canvas.
   - Mempertahankan hierarki judul (`#`, `##`), paragraf, poin *bullet*, dan tabel materi modul.
   - **Tombol Salin Cepat 1-Klik (`📋 Salin Teks OCR (LLM Ready)`)**: Langsung menyalin seluruh materi modul ke clipboard untuk di-*paste* ke Google Gemini / NotebookLM / ChatGPT.
   - Ekspor file **Markdown (.md)** murni atau dokumen **Word (.docx + OCR)** yang berisi tangkapan visual bersanding dengan teks hasil OCR yang dapat diedit.
   - Penghitung kata (*word counter*) dan karakter secara *real-time*.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
| :--- | :--- |
| 📝 **Smart DOM & Canvas OCR Engine** | Ekstraksi teks berakurasi tinggi dengan struktur paragraf, bab, poin, dan tabel yang dipertahankan secara rapi. |
| 📋 **1-Click Copy Teks (LLM Ready)** | Salin ribuan kata materi modul ke clipboard dalam format Markdown siap prompt ke Google Gemini / ChatGPT. |
| 🚀 **Auto-Scan & Smart Page Detection** | Menangkap halaman aktif secara otomatis dan berpindah ke halaman berikutnya dengan simulasi navigasi multi-event cerdas. |
| 🤖 **AI / Google LLM Knowledge Ready** | Dokumen `.docx`, `.md`, & `.pdf` siap diimpor langsung ke Google NotebookLM atau Gemini sebagai sumber kajian modul otomatis. |
| 🎯 **Fleksibilitas Batas Halaman** | Pilihan kuota instan (5, 10, 15, 25, 50, Semua) atau **Input Kustom** untuk menentukan jumlah halaman manual sesuai kebutuhan. |
| 🏷️ **Custom File & Title Labeling** | Berikan judul modul kustom yang otomatis disematkan ke sampul dokumen dan nama file unduhan. |
| 📄 **Word (.docx) Landscape HD + OCR** | Dokumen Word OpenXML murni berorientasi *A4 Landscape*, memadukan screenshot HD dan teks OCR yang dapat disalin. |
| 📑 **Direct Save / Print PDF** | Sekali klik untuk membuka layout cetak siap simpan ke format PDF di browser. |
| 🎨 **Floating Transparent Widget** | Widget kontrol melayang yang *draggable*, dapat di-minimize menjadi ikon badge transparan yang tidak mengganggu area baca. |
| ⚡ **Zero-Lag & Anti-Duplikasi** | Dilengkapi algoritma multi-chunk hash signature untuk memastikan setiap halaman tersimpan akurat tanpa duplikasi. |

---

## 🧠 Integrasi dengan Google LLM & NotebookLM

Dokumen Word (`.docx`), Markdown (`.md`), dan teks OCR yang disalin langsung dari **UT Book Scanner** dapat langsung dijadikan sumber pengetahuan (*grounded source*) untuk asisten AI Google:

```mermaid
graph LR
    A[Modul RBV UT] --> B[UT Book Scanner v1.1.0]
    B --> C1[📋 Salin Teks OCR]
    B --> C2[📄 Export .docx / .md]
    C1 --> D[Prompt Gemini / Claude / ChatGPT]
    C2 --> E[Add Source ke Google NotebookLM]
    D --> F[Analisis & Rangkuman Cerdas]
    E --> F
```

### Langkah Mudah Menggunakan sebagai Sumber Google LLM:
1. **Opsi 1 (Salin Teks Instan):** Klik tab **📝 Pages to OCR**, lakukan scan, lalu klik tombol **📋 Salin Teks OCR (LLM Ready)**. Buka [Google Gemini](https://gemini.google.com/) dan *paste* langsung teks materi dengan prompt belajar.
2. **Opsi 2 (Upload File Dokumen):** Unduh file `.docx` atau `.md`, buka [Google NotebookLM](https://notebooklm.google.com/), buat Notebook baru dan klik **Add Source** ➡️ pilih file hasil scan.
3. **Mulai Belajar dengan AI:**
   - 💬 *Buatkan ringkasan konsep utama dan peta konsep dari Modul ini.*
   - ❓ *Buatkan 10 latihan soal pilihan ganda beserta pembahasan dan kunci jawaban berdasarkan materi modul ini.*
   - 🎧 *Generate Audio Overview (podcast interaktif diskusi modul) secara instan.*

---

## 🚀 Panduan Instalasi Cepat

Ekstensi ini dapat dipasang secara langsung di Google Chrome (*atau browser berbasis Chromium seperti Edge, Brave, Opera*):

1. **Unduh / Clone Repositori:**
   ```bash
   git clone https://github.com/masadjie/ut-learning-book.git
   ```
   *(Atau unduh file ZIP melalui menu **Code -> Download ZIP** lalu ekstrak ke komputer Anda)*.

2. **Buka Menu Ekstensi Chrome:**
   Ketik alamat berikut di address bar browser Anda:
   ```text
   chrome://extensions
   ```

3. **Aktifkan Developer Mode:**
   Nyalakan sakelar **Developer mode** di pojok kanan atas halaman ekstensi.

4. **Muat Ekstensi:**
   Klik tombol **Load unpacked** (*Muat yang belum dibongkar*) di sudut kiri atas, lalu pilih direktori folder `ut-learning-book`.

5. **Selesai!** Ekstensi telah terpasang dan siap digunakan. 🎉

---

## 📖 Cara Penggunaan

```mermaid
graph LR
    A[Buka Kotobee UT] --> B[Pilih Tab Scan / OCR]
    B --> C[Set Label & Batas Halaman]
    C --> D[Klik Mulai Auto-Scan]
    D --> E[Salin Teks OCR / Ekspor Word]
```

1. Buka buku atau modul yang ingin dipelajari di [Kotobee Reader UT](https://univterbuka.kotobee.com/).
2. Arahkan ke halaman awal materi yang diinginkan (misal: *Modul 1*).
3. Widget kontrol **UT Book Scanner** akan otomatis muncul di sudut kanan bawah layar buku.
4. Isi **🏷️ Nama Label / Judul File** (contoh: `ISIP4211 - Logika Modul 1`).
5. Pilih **🎯 Batas Halaman** yang diinginkan (*atau pilih manual untuk memasukkan angka halaman kustom*).
6. Klik **▶️ Mulai Auto-Scan**. Ekstensi akan memindai halaman demi halaman secara otomatis.
7. Setelah selesai, klik tombol:
   - **📄 Word (.docx)** untuk mengunduh dokumen Microsoft Word Landscape.
   - **📑 Cetak / PDF** untuk membuka jendela cetak / simpan sebagai PDF.

---

## 📂 Struktur File & Arsitektur

```text
ut-learning-book/
├── manifest.json            # Spesifikasi Manifest V3 & deklarasi permission
├── icons/                   # Aset ikon resolusi 16px, 48px, 128px & badge logo
├── content/
│   ├── content.js           # Core engine auto-scanner, multi-point hashing & floating UI
│   └── content.css          # Desain antarmuka widget melayang, animasi & transisi
├── popup/
│   ├── popup.html           # Tampilan popup browser action toolbar
│   ├── popup.css            # Styling & tata letak antarmuka popup
│   └── popup.js             # Jembatan komunikasi popup dengan content script
├── libs/
│   └── exporter.js          # Generator dokumen .docx OpenXML murni & PDF print handler
├── LICENSE                  # Lisensi Open-Source (MIT)
└── README.md                # Dokumentasi proyek
```

---

## 🔒 Privasi & Keamanan Pengguna

- **100% Client-Side Processing**: Seluruh operasi capture halaman, pemrosesan citra, kompilasi file Word (.docx), dan pencetakan PDF dilakukan sepenuhnya di dalam lingkungan browser (*in-memory*).
- **Tanpa Pengumpulan Data**: Ekstensi ini sama sekali tidak mengumpulkan, menyimpan di cloud, atau mentransmisikan data akun maupun materi buku ke server eksternal mana pun.

---

## 👨‍💻 Pengembang

**Adjie Kurniawan**
- GitHub: [@masadjie](https://github.com/masadjie)
- Email: [bgdjie46@gmail.com](mailto:bgdjie46@gmail.com)

---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi terbuka [MIT License](LICENSE). Bebas digunakan, dipelajari, dan dikembangkan untuk keperluan edukasi dan produktivitas pribadi.
