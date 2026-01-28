# Panduan Deploy Website Undangan (Gratis & Mudah)

Anda **TIDAK HARUS** menggunakan Git untuk men-deploy website ini. Anda bisa menggunakan cara **Drag & Drop** (Tarik & Lepas) yang sangat mudah.

Berikut adalah dua pilihan cara deploy yang paling populer dan gratis:

---

## Opsi 1: Deploy ke Vercel (Rekomendasi)
*Kelebihan: Server cepat, gratis selamanya untuk personal.*

### Cara Tanpa Git (Drag & Drop):
1.  Pastikan Anda sudah memiliki akun di [Vercel.com](https://vercel.com/) (Bisa login pakai akun Google/Email).
2.  Install **Vercel CLI** di komputer Anda (opsional tapi memudahkan).
    *   Jika tidak ingin install CLI, cukup buka Dashboard Vercel di browser.
3.  Di Dashboard Vercel, klik **"Add New..."** lalu pilih **"Project"**.
4.  Jika diminta "Import Git Repository", lihat bagian bawah ada opsi untuk upload manual atau gunakan Command Line (CLI).
    *   **Cara Paling Mudah via Terminal:**
        1.  Buka terminal di folder project ini (`c:\Users\Mitimes\.gemini\antigravity\scratch\iQIBLA\iQIBLA`).
        2.  Ketik perintah:
            ```bash
            npx vercel
            ```
        3.  Ikuti petunjuk di layar (tekan Enter terus untuk default):
            *   *Set up and deploy?* -> **y**
            *   *Which scope?* -> **(Pilih akun Anda)**
            *   *Link to existing project?* -> **n**
            *   *Project name?* -> **iqibla-invitation** (atau nama lain)
            *   *In which directory?* -> **./** (Langsung Enter)
            *   *Want to modify settings?* -> **n**
        4.  Tunggu sebentar, Vercel akan memberikan link website Anda (contoh: `https://iqibla-invitation.vercel.app`). Selesai!

---

## Opsi 2: Deploy ke Netlify (Alternatif Mudah)
*Kelebihan: Benar-benar Drag & Drop tanpa terminal.*

1.  Buka [Netlify.com](https://www.netlify.com/) dan login/daftar.
2.  Setelah masuk ke Dashboard (Team Overview), cari kotak bertuliskan **"Deploy manually"** atau menu **"Sites"**.
3.  Buka File Explorer di komputer Anda.
4.  Cari folder project `iQIBLA`.
5.  **Tarik (Drag)** satu folder `iQIBLA` tersebut dan **Lepas (Drop)** ke area upload di browser Netlify.
6.  Tunggu loading (biasanya cuma beberapa detik).
7.  Website langsung online! Anda akan dapat link acak (contoh: `https://happy-fermat-12345.netlify.app`).
8.  Anda bisa mengubah nama link di *Site Settings > Change site name*.

---

## Pertanyaan: Apakah Harus Pakai Git?
**Jawabannya: TIDAK.**

*   **Tanpa Git:** Cocok jika Anda hanya ingin website segera online dan jarang di-update. Cukup upload manual seperti cara di atas.
*   **Pakai Git:** Disarankan jika Anda ingin bekerja lebih profesional atau sering update. Dengan Git, setiap kali Anda save & push code, website otomatis ter-update.

**Kesimpulan:**
Untuk kebutuhan sekarang (cepat & praktis), gunakan **Opsi 1 (Vercel via Terminal)** atau **Opsi 2 (Netlify Drag & Drop)**. Keduanya gratis dan tidak butuh Git.
