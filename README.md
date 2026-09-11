# 📖 UT Book Scanner

<p align="center">
  <img src="icons/icon-128.png" width="100" height="100" alt="UT Book Scanner Logo" style="border-radius: 18px;" />
</p>

<p align="center">
  <b>Automated High-Resolution Page Capture & Document Exporter for Universitas Terbuka (Kotobee Reader)</b><br>
  <sub>Created by <b>Adjie Kurniawan</b></sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/manifest-v3-green.svg?style=flat-square" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/platform-Chrome%20Extension-orange.svg?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/license-MIT-purple.svg?style=flat-square" alt="License" />
</p>

---

## 📌 Latar Belakang

Membaca modul digital Ruang Baca Virtual (RBV) Universitas Terbuka di platform Kotobee Reader terkadang membutuhkan akses offline untuk belajar, mencatat ringkasan, atau membuat dokumen rujukan pribadi. 

**UT Book Scanner** adalah ekstensi Google Chrome (Manifest V3) yang dirancang untuk mempermudah mahasiswa mengarsipkan halaman modul secara otomatis dengan kualitas gambar HD, tata letak rapi, dan siap diekspor ke format **Microsoft Word (.docx Landscape)** maupun **PDF**.

---

## ⚡ Fitur Utama

- **🚀 Auto-Scan & Smart Navigation**: Otomatis menangkap halaman aktif dan berpindah ke halaman berikutnya dengan jeda waktu (*delay*) yang dapat diatur agar materi termuat sempurna.
- **🎯 Batas Halaman (Auto-Stop)**: Pilihan batas halaman cepat (5, 10, 15, 25, 50, atau Tanpa Batas) serta opsi **Input Manual** untuk menentukan kuota halaman secara presisi.
- **🏷️ Custom Document Labeling**: Penamaan judul dokumen dan file hasil ekspor otomatis mengikuti label modul yang Anda masukkan (contoh: `MATA411203 - Aljabar Linear`).
- **📄 Word (.docx) Landscape HD**: Menghasilkan dokumen Word berformat OpenXML murni dalam orientasi A4 Landscape, menjaga aspek rasio tangkapan layar buku tanpa distorsi.
- **📑 Direct Print / Save to PDF**: 1-klik untuk membuka layout siap cetak dan memicu dialog penyimpanan PDF di browser.
- **🎨 Floating Transparent Widget**: Widget kontrol melayang yang *draggable*, dilengkapi mode *minimize* berupa floating badge transparan yang tidak menghalangi tampilan baca.
- **⚡ Zero-Lag In-Memory Architecture**: Pemrosesan gambar dioptimalkan pada level memori tanpa membebani penyimpanan lokal browser, menjaga performa tetap mulus saat men-scan puluhan halaman.

---

## 🛠️ Instalasi

Ekstensi ini dapat dipasang secara langsung di Google Chrome melalui mode *Developer*:

1. **Clone atau Unduh Repositori ini:**
   ```bash
   git clone https://github.com/masadjie/ut-learning-book.git
   ```
2. Buka browser **Google Chrome** dan navigasikan ke:
   ```text
   chrome://extensions
   ```
3. Aktifkan sakelar **Developer mode** (Mode Pengembang) di pojok kanan atas.
4. Klik tombol **Load unpacked** (Muat yang belum dibongkar) di pojok kiri atas.
5. Pilih folder proyek `ut-learning-book`.
6. Ekstensi **UT Book Scanner** telah terpasang dan siap digunakan! 🎉

---

## 📖 Panduan Penggunaan

1. Buka modul buku di [Kotobee Reader UT](https://univterbuka.kotobee.com/).
2. Buka halaman awal materi yang ingin Anda scan (misal: *Modul 1* atau *KB 1*).
3. Anda akan melihat widget **UT Book Scanner** di pojok kanan bawah layar (atau klik ikon ekstensi di toolbar browser).
4. Berikan nama label pada kolom **🏷️ Nama Label / Judul File** (misal: `Modul 1 - Matriks`).
5. Tentukan **🎯 Batas Halaman** sesuai kebutuhan Anda.
6. Klik **▶️ Mulai Auto-Scan**: Halaman akan terscan otomatis hingga batas tercapai atau tombol **⏹️ Stop** diklik.
7. Pilih format ekspor:
   - Klik **📄 Word (.docx)** untuk mengunduh dokumen `.docx`.
   - Atau klik **📑 Cetak / PDF** untuk mencetak atau menyimpan sebagai PDF.

---

## 📂 Struktur Proyek

```text
ut-learning-book/
├── manifest.json            # Konfigurasi Manifest V3
├── icons/                   # Aset icon ekstensi (16x16, 48x48, 128x128, logo)
├── content/
│   ├── content.js           # Engine auto-scanner, DOM extractor & floating widget
│   └── content.css          # Desain UI widget, transisi & styling
├── popup/
│   ├── popup.html           # Tampilan popup toolbar
│   ├── popup.css            # Styling popup
│   └── popup.js             # Handler & kontrol komunikasi popup
├── libs/
│   └── exporter.js          # Generator dokumen .docx OpenXML & PDF printer
└── README.md
```

---

## 🔒 Privasi & Keamanan

- Ekstensi ini **tidak mengumpulkan, melacak, atau mengirimkan data** Anda ke server eksternal mana pun.
- Seluruh pemrosesan teks, gambar, dan pembentukan dokumen dilakukan 100% secara lokal (*client-side*) di dalam browser Anda.

---

## 👨‍💻 Author

**Adjie Kurniawan**
- GitHub: [@masadjie](https://github.com/masadjie)
- Email: bgdjie46@gmail.com

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE).
