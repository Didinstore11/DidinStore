# DIDIN STORE — paket siap GitHub untuk situs Netlify yang SUDAH ADA

Paket ini mempertahankan file katalog DIDIN STORE: katalog, pencarian/filter, keranjang, dan checkout WhatsApp.
**Paket ini tidak otomatis mengubah situs online dan tidak membuat situs baru.** Hubungkan repository ini ke proyek Netlify `didinstore11` yang sudah ada hanya setelah file diperiksa.

## Isi paket
- `index.html`, `style.css`, `app.js`: tampilan katalog, keranjang, checkout WhatsApp
- `config.js`: nama toko dan nomor WhatsApp
- `products.js`: data produk, termasuk produk Free Fire Rp500.000
- `admin.html`: alat lokal untuk memilih foto dan mengekspor `products.js`
- `netlify.toml`: konfigurasi situs statis

## Penting tentang upload foto
`admin.html` dapat memilih foto dari galeri HP, tetapi **belum menyimpan perubahan langsung ke server Netlify**. Setelah menambah produk/foto, file `products.js` hasil ekspor harus dimasukkan ke repository dan dipublikasikan ulang. Upload langsung yang tersimpan tanpa deploy ulang memerlukan fungsi server/penyimpanan dan pengamanan admin; fitur itu tidak termasuk dalam paket ini.

## Sebelum menghubungkan ke Netlify
1. Simpan salinan file situs yang sedang online sebagai cadangan.
2. Pastikan nomor WhatsApp di `config.js` benar.
3. Pastikan harga, stok, dan deskripsi di `products.js` benar.
4. Jangan masukkan password, OTP, email pemulihan, atau data rahasia akun ke katalog.

## Menghubungkan ke situs Netlify yang SUDAH ADA
1. Ekstrak ZIP ini di HP/komputer.
2. Unggah **isi folder** (bukan file ZIP-nya) ke repository GitHub `didin-store`, di folder utama repository. File seperti `index.html`, `app.js`, `config.js`, `products.js`, `style.css`, dan `netlify.toml` harus terlihat di halaman utama repository.
3. Di Netlify, buka proyek yang sudah ada bernama `didinstore11`.
4. Cari pengaturan **Build & deploy / Continuous deployment** lalu opsi **Link repository** atau **Link to Git provider**. Pilih GitHub dan repository `didin-store`.
5. Jika diminta pengaturan build, untuk situs statis ini gunakan build command kosong dan publish directory `.`.
6. Sebelum mengonfirmasi deploy pertama, pastikan kamu sedang menghubungkan proyek `didinstore11` yang lama, bukan membuat proyek/situs baru. Jangan pilih Delete site.
7. Setelah terhubung, Netlify akan memublikasikan isi repository. Periksa situs, katalog, keranjang, dan checkout WhatsApp segera sesudahnya.

## Jika menu Link repository tidak ada
Jangan buat situs baru dan jangan upload folder dulu ke area Netlify Drop. Kirim screenshot halaman pengaturan Netlify; menu yang tersedia bisa berbeda menurut akun.
