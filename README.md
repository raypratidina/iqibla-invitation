# Panduan Menjalankan Project (Undangan Digital)

Berikut adalah beberapa cara untuk menjalankan project ini di terminal komputer Anda.

## Pilihan 1: Menggunakan Node.js (npx) - *Paling Populer*
Jika Anda sudah menginstall [Node.js](https://nodejs.org/), ini adalah cara yang standar.

1.  Buka terminal atau Command Prompt.
2.  Masuk ke direktori folder project ini.
    ```bash
    cd c:\Users\Mitimes\.gemini\antigravity\scratch\iQIBLA\iQIBLA
    ```
    *(Sesuaikan path jika folder Anda berbeda)*
3.  Jalankan perintah berikut:
    ```bash
    npx serve .
    ```
    *Jika diminta konfirmasi instalasi `serve`, ketik `y` dan Enter.*
4.  Website akan berjalan di `http://localhost:3000` (atau port lain yang ditampilkan).

## Pilihan 2: Menggunakan Python
Jika Anda tidak punya Node.js tapi punya Python:

1.  Buka terminal.
2.  Masuk ke direktori folder project.
3.  Jalankan perintah:
    ```bash
    python -m http.server 8080
    ```
4.  Buka browser dan buka `http://localhost:8080`.

## Pilihan 3: Menggunakan VS Code Live Server
Jika Anda menggunakan Visual Studio Code:

1.  Buka tab **Extensions** (Ctrl+Shift+X).
2.  Cari dan install **"Live Server"** (by Ritwick Dey).
3.  Buka file `index.html`.
4.  Klik tombol **"Go Live"** di pojok kanan bawah window VS Code.
