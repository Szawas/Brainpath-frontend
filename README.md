# Brainpath Frontend

Brainpath Frontend adalah antarmuka pengguna untuk sistem **Brainpath**, yaitu platform **AI Course Recommender** yang membantu pengguna menemukan rekomendasi kursus atau resource belajar IT berdasarkan minat, hasil onboarding, kategori, deskripsi resource, dan tingkat relevansi konten.

Pada tahap MVP, Brainpath difokuskan untuk menampilkan rekomendasi resource eksternal seperti video YouTube, artikel, atau kursus online. Frontend ini dikembangkan menggunakan **Vue 3**, **Vite**, dan **Tailwind CSS**.

---

## Fitur Utama

- Landing page untuk memperkenalkan Brainpath
- Login page
- Dashboard user
- Onboarding untuk mengetahui pemahaman awal pengguna
- Reframing page untuk mengenalkan bidang-bidang IT
- Interest form / kuis minat
- Recommendation page untuk menampilkan hasil rekomendasi course/resource
- Resource preview page untuk melihat ringkasan resource sebelum membuka link eksternal
- Admin resource management untuk mengelola resource rekomendasi

---

## Tentang Brainpath

Brainpath adalah sistem rekomendasi kursus IT berbasis AI yang membantu pengguna menemukan sumber belajar yang sesuai dengan minat, tingkat pemahaman, dan tujuan belajarnya.

Melalui proses onboarding dan kuis minat, Brainpath akan memberikan rekomendasi resource belajar eksternal yang relevan. Sistem ini tidak berperan sebagai LMS penuh, melainkan sebagai **AI Course Recommender** yang membantu pengguna memilih sumber belajar dengan lebih terarah.

---

## 🛠️ Tech Stack

- **Vue 3** — framework utama frontend
- **Vite** — build tool
- **Vue Router** — routing antar halaman
- **Pinia** — state management
- **Tailwind CSS** — styling antarmuka
- **Axios** — komunikasi HTTP request ke backend API
- **Lucide Vue** — ikon antarmuka
- **SweetAlert2** — alert/popup interaktif

---

## Project Setup

Pastikan perangkat sudah memiliki:

- **Node.js** versi 20 atau lebih baru
- **npm** sebagai package manager
- **Git** untuk clone repository
- **VS Code** atau code editor lain

---

### 1. Clone Repository

```bash
git clone https://github.com/Szawas/Brainpath-frontend.git
cd Brainpath-frontend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Compile and Hot-Reload for Development

```sh
npm run dev
```

### 4. Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
