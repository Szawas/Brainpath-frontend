# Frontend Documentation - BrainPath

Dokumen ini menjelaskan kondisi aktual folder `frontend` pada proyek BrainPath. Fokusnya adalah membantu tim memahami struktur aplikasi, route, komponen, data dummy, status integrasi, dan kebutuhan backend yang relevan untuk pengembangan berikutnya.

## 1. Overview

BrainPath adalah frontend aplikasi rekomendasi resource belajar IT. Pada kondisi saat ini, aplikasi berfungsi sebagai MVP rekomendasi resource eksternal, bukan LMS internal.

Resource yang ditampilkan dapat berupa video YouTube, course online, artikel, atau sumber belajar eksternal lain. Frontend menyediakan alur dari landing page, login mock, dashboard user, onboarding, pemilihan minat, rekomendasi, preview resource, hingga halaman admin sederhana.

## 2. Tech Stack Aktual

Stack yang benar-benar digunakan pada folder `frontend`:

| Teknologi                | Fungsi                                                                            |
| ------------------------ | --------------------------------------------------------------------------------- |
| Vue 3                    | Framework frontend utama                                                          |
| Vite                     | Dev server dan build tool                                                         |
| Vue Router               | Routing antar halaman                                                             |
| Pinia                    | State management, sudah dipasang tetapi saat ini hanya ada store contoh `counter` |
| Tailwind CSS v4          | Styling melalui `@tailwindcss/vite` dan `src/assets/main.css`                     |
| Lucide Vue Next          | Ikon antarmuka                                                                    |
| ESLint, Oxlint, Prettier | Linting dan formatting                                                            |

Catatan:

- Axios belum menjadi dependency di `package.json`.
- Integrasi API backend belum tersedia.
- Auth saat ini masih mock berbasis `localStorage` melalui `src/lib/auth.js`.
- Node yang direkomendasikan oleh `package.json`: `^20.19.0 || >=22.12.0`.

## 3. Project Structure

Struktur utama folder frontend saat ini:

```txt
frontend/
|-- public/
|-- src/
|   |-- assets/
|   |   `-- main.css
|   |-- components/
|   |   |-- admin/
|   |   |   |-- AdminResourceTable.vue
|   |   |   `-- AdminTopNavbar.vue
|   |   |-- common/
|   |   |   |-- BaseButton.vue
|   |   |   |-- BaseCard.vue
|   |   |   |-- IconBox.vue
|   |   |   |-- StepProgress.vue
|   |   |   `-- SummaryCard.vue
|   |   |-- layout/
|   |   |   |-- AppNavbar.vue
|   |   |   `-- AppSidebar.vue
|   |   |-- onboarding/
|   |   |   |-- InterestOptionCard.vue
|   |   |   |-- KnowledgeOptionCard.vue
|   |   |   `-- OnboardingHeader.vue
|   |   |-- recommendation/
|   |   |   |-- RecommendationCard.vue
|   |   |   `-- RecommendationFilter.vue
|   |   `-- resource/
|   |       |-- AISummarySection.vue
|   |       `-- VideoPreview.vue
|   |-- data/
|   |   `-- resources.js
|   |-- lib/
|   |   `-- auth.js
|   |-- router/
|   |   `-- index.js
|   |-- stores/
|   |   `-- counter.js
|   |-- views/
|   |   |-- AdminAnalytics.vue
|   |   |-- AdminResources.vue
|   |   |-- AdminSettings.vue
|   |   |-- Dashboard.vue
|   |   |-- History.vue
|   |   |-- InterestForm.vue
|   |   |-- Landing.vue
|   |   |-- Login.vue
|   |   |-- Onboarding.vue
|   |   |-- Profile.vue
|   |   |-- Recommendation.vue
|   |   |-- Reframing.vue
|   |   `-- ResourcePreview.vue
|   |-- App.vue
|   `-- main.js
|-- index.html
|-- package.json
|-- vite.config.js
|-- eslint.config.js
|-- jsconfig.json
`-- FE-doc.md
```

Folder yang biasanya tidak perlu dijadikan sumber dokumentasi fitur:

- `node_modules/`: dependency lokal.
- `dist/`: hasil build production.
- `.vscode/`: konfigurasi editor lokal.
- `vite-dev.out.log` dan `vite-dev.err.log`: log dev server lama.

## 4. Routing Aktual

Routing didefinisikan di `src/router/index.js` dan menggunakan `createWebHistory`.

| Route              | Name               | View                  | Role   | Keterangan                          |
| ------------------ | ------------------ | --------------------- | ------ | ----------------------------------- |
| `/`                | `landing`          | `Landing.vue`         | Public | Halaman awal aplikasi               |
| `/login`           | `login`            | `Login.vue`           | Public | Login mock                          |
| `/dashboard`       | `dashboard`        | `Dashboard.vue`       | User   | Ringkasan user dan rekomendasi awal |
| `/onboarding`      | `onboarding`       | `Onboarding.vue`      | User   | Pertanyaan kondisi awal user        |
| `/reframing`       | `reframing`        | `Reframing.vue`       | User   | Edukasi singkat bidang IT           |
| `/interest-form`   | `interest-form`    | `InterestForm.vue`    | User   | Form minat dan tujuan belajar       |
| `/recommendation`  | `recommendation`   | `Recommendation.vue`  | User   | Daftar rekomendasi resource         |
| `/resources/:id`   | `resource-preview` | `ResourcePreview.vue` | User   | Preview detail resource             |
| `/profile`         | `profile`          | `Profile.vue`         | User   | Profil user mock                    |
| `/history`         | `history`          | `History.vue`         | User   | Riwayat resource mock               |
| `/admin/resources` | `admin-resources`  | `AdminResources.vue`  | Admin  | Manajemen resource mock             |
| `/admin/analytics` | `admin-analytics`  | `AdminAnalytics.vue`  | Admin  | Statistik admin mock                |
| `/admin/settings`  | `admin-settings`   | `AdminSettings.vue`   | Admin  | Pengaturan admin mock               |

Route guard:

- Route dengan `meta.requiresAuth` hanya bisa dibuka jika `isAuthenticated()` bernilai true.
- Role route dicek dari user di `localStorage`.
- User non-admin diarahkan ke `/dashboard`.
- Admin diarahkan ke `/admin/resources`.

## 5. Auth Aktual

Auth dikelola di `src/lib/auth.js` dan masih bersifat mock.

Storage key:

```js
const AUTH_KEY = 'brainpath_auth'
```

Perilaku login:

- Email `admin@brainpath.dev` dianggap sebagai admin.
- Email selain itu dianggap sebagai user biasa.
- Data user disimpan di `window.localStorage`.
- Belum ada password validation atau request ke backend.

Contoh user yang disimpan:

```json
{
  "email": "user@email.com",
  "role": "user",
  "name": "User"
}
```

## 6. User Flow Aktual

Alur user yang didukung oleh route dan view saat ini:
Landing
-> Login
-> Dashboard
-> Onboarding
-> Reframing jika user belum memahami dunia IT
-> Interest Form
-> Recommendation
-> Resource Preview
-> External Link

```

Alur admin:
Login menggunakan admin@brainpath.dev
-> Admin Resources
-> Admin Analytics
-> Admin Settings
```

## 7. Page Summary

### 7.1 Landing

View: `src/views/Landing.vue`

Halaman publik untuk memperkenalkan BrainPath. Menggunakan `AppNavbar` dan `SummaryCard`, serta ikon dari Lucide.

### 7.2 Login

View: `src/views/Login.vue`

Halaman login mock. Setelah login:

- Admin diarahkan ke `/admin/resources`.
- User diarahkan ke `/dashboard`.
- Jika ada query `redirect`, route tersebut dapat digunakan sebagai tujuan setelah login.

### 7.3 Dashboard

View: `src/views/Dashboard.vue`

Dashboard user dengan sidebar. Menampilkan ringkasan, kategori, dan resource rekomendasi dari data lokal.

### 7.4 Onboarding

View: `src/views/Onboarding.vue`

Halaman untuk menentukan apakah user sudah memahami dunia IT atau belum. Komponen utama:

- `StepProgress`
- `KnowledgeOptionCard`
- `BaseCard`

### 7.5 Reframing

View: `src/views/Reframing.vue`

Halaman edukasi singkat tentang beberapa bidang IT seperti frontend, backend, data, dan AI sebelum user memilih minat.

### 7.6 Interest Form

View: `src/views/InterestForm.vue`

Form preferensi belajar. State masih lokal di komponen menggunakan `ref` dan `computed`. Belum menyimpan hasil ke backend.

### 7.7 Recommendation

View: `src/views/Recommendation.vue`

Menampilkan resource dari `src/data/resources.js`. Filter kategori dilakukan di sisi frontend berdasarkan `resource.category`.

Komponen utama:

- `RecommendationFilter`
- `RecommendationCard`
- `AppSidebar`

### 7.8 Resource Preview

View: `src/views/ResourcePreview.vue`

Menampilkan detail resource berdasarkan route param `id`. Data diambil menggunakan helper `getResourceById(id)`. Jika id tidak ditemukan, fallback ke resource pertama.

Komponen utama:

- `VideoPreview`
- `AISummarySection`
- `BaseCard`
- `BaseButton`

### 7.9 History

View: `src/views/History.vue`

Menampilkan riwayat mock dari tiga resource pertama di `src/data/resources.js`.

### 7.10 Profile

View: `src/views/Profile.vue`

Halaman profil user mock dengan layout sidebar.

### 7.11 Admin Resources

View: `src/views/AdminResources.vue`

Halaman admin untuk melihat daftar resource lokal. Data berasal dari `src/data/resources.js`, lalu dipetakan menjadi `adminResources`.

Komponen utama:

- `AdminTopNavbar`
- `AdminResourceTable`
- `BaseCard`
- `BaseButton`

### 7.12 Admin Analytics

View: `src/views/AdminAnalytics.vue`

Halaman statistik admin mock. Belum terhubung ke endpoint analytics.

### 7.13 Admin Settings

View: `src/views/AdminSettings.vue`

Halaman pengaturan admin mock. Belum menyimpan konfigurasi ke backend.

## 8. Components

### 8.1 Common Components

| Komponen           | Fungsi                                            |
| ------------------ | ------------------------------------------------- |
| `BaseButton.vue`   | Button/link reusable dengan dukungan `RouterLink` |
| `BaseCard.vue`     | Wrapper card reusable                             |
| `IconBox.vue`      | Container ikon konsisten                          |
| `StepProgress.vue` | Indikator progres step onboarding                 |
| `SummaryCard.vue`  | Card ringkasan untuk dashboard/admin/landing      |

### 8.2 Layout Components

| Komponen         | Fungsi                                                               |
| ---------------- | -------------------------------------------------------------------- |
| `AppNavbar.vue`  | Navbar halaman publik                                                |
| `AppSidebar.vue` | Sidebar halaman user, termasuk logout dan link admin jika role admin |

### 8.3 Onboarding Components

| Komponen                  | Fungsi                                 |
| ------------------------- | -------------------------------------- |
| `KnowledgeOptionCard.vue` | Pilihan kondisi pemahaman IT           |
| `InterestOptionCard.vue`  | Pilihan minat belajar                  |
| `OnboardingHeader.vue`    | Header onboarding dengan step progress |

### 8.4 Recommendation Components

| Komponen                   | Fungsi                          |
| -------------------------- | ------------------------------- |
| `RecommendationCard.vue`   | Card hasil rekomendasi resource |
| `RecommendationFilter.vue` | Filter kategori rekomendasi     |

### 8.5 Resource Components

| Komponen               | Fungsi                           |
| ---------------------- | -------------------------------- |
| `VideoPreview.vue`     | Preview thumbnail/video resource |
| `AISummarySection.vue` | Ringkasan AI dan poin belajar    |

### 8.6 Admin Components

| Komponen                 | Fungsi                      |
| ------------------------ | --------------------------- |
| `AdminTopNavbar.vue`     | Navbar khusus halaman admin |
| `AdminResourceTable.vue` | Tabel daftar resource admin |

## 9. Data Dummy Aktual

Data dummy berada di:

```txt
src/data/resources.js
```

Export yang tersedia:

```js
export const resources = [...]
export const getResourceById = (id) => ...
```

Struktur resource aktual:

```js
{
  id: 1,
  title: 'HTML & CSS Dasar',
  source: 'YouTube - Web Programming UNPAS',
  category: 'Frontend',
  level: 'Pemula',
  duration: '45 menit',
  tags: ['HTML', 'CSS', 'Website Dasar'],
  description: 'Pengenalan struktur HTML dan styling CSS untuk membuat halaman web pertama.',
  reason: 'Cocok untuk memulai dari struktur halaman dan styling sebelum masuk JavaScript.',
  relevanceScore: 96,
  externalUrl: 'https://www.youtube.com/results?search_query=html+css+dasar+web+programming+unpas',
  thumbnailUrl: 'https://img.youtube.com/vi/UB1O30fR-EE/hqdefault.jpg',
  aiSummary: 'Materi ini membahas dasar HTML dan CSS untuk membangun struktur dan tampilan halaman web.',
  learningPoints: [
    'Struktur dasar HTML',
    'Elemen dan tag umum'
  ],
  targetLearners: [
    'Pemula yang baru mulai belajar web development.'
  ],
  videoRoadmap: [
    {
      title: 'Pengenalan HTML dan CSS',
      time: '00:00 - 06:00'
    }
  ]
}
```

Kategori yang muncul di data saat ini:

- `Frontend`
- `Backend`
- `Data`
- `AI`

Catatan:

- Field menggunakan camelCase di frontend, misalnya `relevanceScore`, `externalUrl`, `thumbnailUrl`, `aiSummary`.
- Field `status` belum ada pada data dummy resource aktual, tetapi halaman admin menambahkan status saat memetakan data.

## 10. State Management

Pinia sudah dipasang di `src/main.js`:

```js
app.use(createPinia())
```

Namun store aktual di `src/stores/counter.js` masih store contoh dari template. Belum ada store production untuk auth, onboarding, rekomendasi, resource, atau admin.

Untuk pengembangan berikutnya, kandidat store yang berguna:

- `authStore`
- `resourceStore`
- `recommendationStore`
- `onboardingStore`

## 11. Styling

Styling utama:

- Tailwind CSS v4 diaktifkan melalui plugin `@tailwindcss/vite`.
- File global ada di `src/assets/main.css`.
- `main.css` mengatur import Tailwind, ukuran font desktop, dan `scroll-padding-top`.

Isi global saat ini ringkas:

```css
@import 'tailwindcss';
```

## 12. Script Development

Script dari `package.json`:

| Command           | Fungsi                                        |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Menjalankan Vite dev server                   |
| `npm run build`   | Build production ke folder `dist`             |
| `npm run preview` | Preview hasil build                           |
| `npm run lint`    | Menjalankan oxlint dan eslint dengan auto-fix |
| `npm run format`  | Format file di `src/` dengan Prettier         |

Setup awal:

```sh
npm install
npm run dev
```

Build production:

```sh
npm run build
```

## 13. Kebutuhan API untuk Integrasi Backend

Bagian ini adalah rancangan kebutuhan integrasi, bukan implementasi yang sudah ada.

### 13.1 Auth

| Method | Endpoint      | Fungsi               |
| ------ | ------------- | -------------------- |
| `POST` | `/api/login`  | Login user/admin     |
| `POST` | `/api/logout` | Logout user/admin    |
| `GET`  | `/api/me`     | Mengambil user aktif |

Response user disarankan minimal:

```json
{
  "id": 1,
  "name": "User",
  "email": "user@email.com",
  "role": "user"
}
```

### 13.2 Onboarding dan Interest

| Method | Endpoint             | Fungsi                                       |
| ------ | -------------------- | -------------------------------------------- |
| `POST` | `/api/onboarding`    | Menyimpan hasil onboarding dan interest form |
| `GET`  | `/api/onboarding/me` | Mengambil hasil onboarding user aktif        |

Payload yang dibutuhkan:

```json
{
  "has_it_knowledge": false,
  "interests": ["Membuat Website/Aplikasi", "Data & Analisis"],
  "learning_goal": "Belajar frontend dari dasar",
  "note": "Saya ingin bisa membuat website sendiri"
}
```

### 13.3 Resources

| Method | Endpoint              | Fungsi                    |
| ------ | --------------------- | ------------------------- |
| `GET`  | `/api/resources`      | Mengambil daftar resource |
| `GET`  | `/api/resources/{id}` | Mengambil detail resource |

Response resource sebaiknya bisa dipetakan ke field frontend:

```json
{
  "id": 1,
  "title": "HTML & CSS Dasar",
  "source": "YouTube - Web Programming UNPAS",
  "category": "Frontend",
  "level": "Pemula",
  "duration": "45 menit",
  "tags": ["HTML", "CSS", "Website Dasar"],
  "description": "Pengenalan struktur HTML dan styling CSS.",
  "reason": "Cocok untuk pemula frontend.",
  "relevance_score": 96,
  "external_url": "https://example.com",
  "thumbnail_url": "https://example.com/thumb.jpg",
  "ai_summary": "Ringkasan materi.",
  "learning_points": ["Struktur dasar HTML"],
  "target_learners": ["Pemula web development"],
  "video_roadmap": [
    {
      "title": "Pengenalan HTML",
      "time": "00:00 - 06:00"
    }
  ],
  "status": "published"
}
```

### 13.4 Recommendations

| Method | Endpoint                      | Fungsi                                      |
| ------ | ----------------------------- | ------------------------------------------- |
| `POST` | `/api/recommendations`        | Generate rekomendasi berdasarkan minat user |
| `GET`  | `/api/recommendations/latest` | Mengambil rekomendasi terakhir user         |

Response rekomendasi:

```json
{
  "user_id": 1,
  "recommendations": [
    {
      "resource_id": 1,
      "title": "HTML & CSS Dasar",
      "source": "YouTube - Web Programming UNPAS",
      "category": "Frontend",
      "level": "Pemula",
      "duration": "45 menit",
      "tags": ["HTML", "CSS"],
      "reason": "Cocok untuk pemula frontend.",
      "relevance_score": 96,
      "external_url": "https://example.com",
      "thumbnail_url": "https://example.com/thumb.jpg"
    }
  ]
}
```

### 13.5 Recommendation Logs dan History

| Method | Endpoint                         | Fungsi                          |
| ------ | -------------------------------- | ------------------------------- |
| `POST` | `/api/recommendation-logs`       | Mencatat preview/click resource |
| `GET`  | `/api/recommendation-logs/me`    | Riwayat user aktif              |
| `GET`  | `/api/admin/recommendation-logs` | Riwayat untuk admin             |

Payload log:

```json
{
  "resource_id": 1,
  "action": "preview"
}
```

Action yang disarankan:

- `preview`
- `external_click`

### 13.6 Admin Resources

| Method   | Endpoint                    | Fungsi                   |
| -------- | --------------------------- | ------------------------ |
| `GET`    | `/api/admin/resources`      | Mengambil semua resource |
| `POST`   | `/api/admin/resources`      | Membuat resource         |
| `PUT`    | `/api/admin/resources/{id}` | Mengubah resource        |
| `DELETE` | `/api/admin/resources/{id}` | Menghapus resource       |

### 13.7 Admin Analytics

| Method | Endpoint               | Fungsi                    |
| ------ | ---------------------- | ------------------------- |
| `GET`  | `/api/admin/analytics` | Mengambil statistik admin |

Data yang dibutuhkan halaman admin:

- Total resource.
- Total klik rekomendasi.
- Kategori terpopuler.
- Resource terpopuler.
- Tren aktivitas user.

## 14. Mapping Field Backend ke Frontend

Karena frontend saat ini memakai camelCase, sedangkan API biasanya memakai snake_case, mapping perlu disepakati.

| Backend           | Frontend         |
| ----------------- | ---------------- |
| `relevance_score` | `relevanceScore` |
| `external_url`    | `externalUrl`    |
| `thumbnail_url`   | `thumbnailUrl`   |
| `ai_summary`      | `aiSummary`      |
| `learning_points` | `learningPoints` |
| `target_learners` | `targetLearners` |
| `video_roadmap`   | `videoRoadmap`   |

Opsional:

- Backend bisa mengembalikan snake_case lalu frontend membuat adapter.
- Backend bisa mengembalikan camelCase khusus untuk frontend.

## 15. Status Implementasi Aktual

| Area                | Status    | Catatan                                |
| ------------------- | --------- | -------------------------------------- |
| Vue + Vite setup    | Done      | Aplikasi sudah berjalan sebagai SPA    |
| Tailwind setup      | Done      | Menggunakan Tailwind v4 plugin Vite    |
| Routing             | Done      | Route public, user, dan admin tersedia |
| Route guard         | Done mock | Berdasarkan `localStorage` dan role    |
| Landing             | Done UI   | Data statis                            |
| Login               | Done mock | Belum memakai backend                  |
| Dashboard           | Done mock | Data lokal/statis                      |
| Onboarding          | Done UI   | Belum persist ke backend               |
| Reframing           | Done UI   | Data statis                            |
| Interest Form       | Done UI   | Belum persist ke backend               |
| Recommendation      | Done mock | Menggunakan `src/data/resources.js`    |
| Resource Preview    | Done mock | Menggunakan `getResourceById`          |
| History             | Done mock | Menggunakan subset data resource lokal |
| Profile             | Done mock | Belum memakai data backend             |
| Admin Resources     | Done mock | Data resource lokal                    |
| Admin Analytics     | Done mock | Belum memakai endpoint analytics       |
| Admin Settings      | Done mock | Belum persist                          |
| Pinia               | Installed | Store production belum dibuat          |
| API integration     | Pending   | Belum ada API client                   |
| Backend integration | Pending   | Semua data masih mock/lokal            |

## 16. MVP Limitation

Batasan frontend saat ini:

- Belum ada login/register backend.
- Belum ada token/session backend.
- Belum ada API client.
- Belum ada persist onboarding dan interest form.
- Belum ada generate recommendation dari backend/ML service.
- Belum ada CRUD admin yang benar-benar menyimpan data.
- Belum ada tracking click/preview ke backend.
- Belum ada LMS internal, progress belajar, sertifikat, atau course completion tracking.

Fokus MVP yang sudah tergambar:

```txt
Onboarding
-> Interest Form
-> Recommendation
-> Resource Preview
-> External Link
```

## 17. Rekomendasi Next Step

Prioritas teknis berikutnya:

1. Tambahkan API client, misalnya `src/lib/api.js`.
2. Ganti auth mock di `src/lib/auth.js` dengan login backend.
3. Buat store Pinia untuk auth dan resource/recommendation.
4. Buat adapter field snake_case ke camelCase jika backend menggunakan snake_case.
5. Hubungkan `Recommendation.vue` dan `ResourcePreview.vue` ke endpoint backend.
6. Hubungkan `History.vue` ke recommendation logs.
7. Hubungkan halaman admin ke endpoint resource dan analytics.
