
# React.js Frontend Application

Ini adalah aplikasi frontend yang dibuat menggunakan React.js. Aplikasi ini terhubung ke backend API menggunakan konfigurasi `axios` yang telah disiapkan di `src/api/api.js`.
Untuk source code API dapat diakses di: https://github.com/bruhmoments/expense_api

## Persyaratan
- [Node.js](https://nodejs.org/) versi terbaru
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/) untuk pengelolaan paket

## Instalasi
Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini secara lokal:

1. Clone repositori ini:
   ```bash
   git clone <URL_REPOSITORI>
   cd <NAMA_FOLDER_PROYEK>
   ```

2. Instal dependensi yang dibutuhkan:
   ```bash
   npm install
   ```
   atau jika menggunakan yarn:
   ```bash
   yarn install
   ```

3. Atur URL API di `src/api/api.js`:
   File `src/api/api.js` digunakan untuk mengatur koneksi ke backend API. Berikut adalah contoh konfigurasi:
   ```javascript
   import axios from 'axios';

   const API = axios.create({
     baseURL: 'http://localhost:8080', // URL KE API
     headers: {
       'Content-Type': 'application/json',
     },
   });

   // Menggunakan JWT secara otomatis
   API.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) config.headers.Authorization = `Bearer ${token}`;
     return config;
   });

   export default API;
   ```

   - Pastikan mengganti `baseURL` dengan URL API Anda.

4. Jalankan aplikasi:
   ```bash
   npm start
   ```
   atau jika menggunakan yarn:
   ```bash
   yarn start
   ```

   Aplikasi akan berjalan di `http://localhost:3000` secara default.

## Struktur Proyek
Berikut adalah struktur utama direktori:
```
.
├── public/            # File publik seperti index.html
├── src/               # Kode sumber aplikasi
│   ├── api/           # Konfigurasi API menggunakan axios
│   │   └── api.js     # File pengaturan API
│   ├── components/    # Komponen React
│   ├── pages/         # Halaman aplikasi
│   └── ...            # File lainnya
├── package.json       # File konfigurasi npm/yarn
├── README.md          # Dokumentasi proyek
└── ...
```

