# AGENTS.md

Panduan kerja untuk agent atau developer yang akan membaca, memperbaiki, atau menambah fitur di repository `brainpath-frontend`.

## Ringkasan Project

Brainpath Frontend adalah aplikasi Vue 3 berbasis Vite untuk rekomendasi kursus atau resource belajar IT berbasis minat pengguna. Aplikasi ini mencakup landing page, autentikasi, onboarding, rekomendasi kursus, preview materi, kuis pemahaman, riwayat belajar, chatbot berbasis konteks kursus, profil pengguna, dan panel admin untuk resource serta analytics.

Project ini bukan LMS penuh. Fokus utamanya adalah mengarahkan user ke resource eksternal, terutama video atau kursus online, lalu memberi ringkasan, roadmap, dan kuis pendukung di sisi frontend.

## Stack Utama

- Vue 3 dengan `<script setup>`.
- Vite sebagai dev server dan build tool.
- Vue Router untuk routing dan route guard.
- Pinia untuk state management.
- Axios untuk komunikasi API backend.
- Tailwind CSS v4 melalui `@tailwindcss/vite`.
- Lucide Vue Next untuk icon.
- SweetAlert2 untuk dialog, alert, dan konfirmasi.
- ESLint, Oxlint, dan Prettier untuk kualitas kode.

## Perintah Umum

Gunakan Node sesuai `package.json`: `^20.19.0 || >=22.12.0`.

```sh
npm install
npm run dev
npm run build
npm run lint
npm run format
```

Catatan penting:

- `npm run lint` menjalankan `oxlint` dan `eslint` dengan mode `--fix`, jadi command ini dapat mengubah file.
- `npm run format` hanya menargetkan folder `src/`.
- Tidak ada script test otomatis di `package.json`.
- Build output berada di `dist/` dan tidak perlu diedit manual.

## Struktur Direktori

```txt
src/
|-- assets/                 # CSS global Tailwind dan utility global
|-- components/
|   |-- admin/              # Komponen khusus panel admin
|   |-- common/             # Button, card, empty state, progress, summary
|   |-- layout/             # Navbar publik dan sidebar user
|   |-- onboarding/         # Card dan header onboarding
|   |-- recommendation/     # Filter, skeleton, dan card rekomendasi
|   `-- resource/           # Preview video dan AI summary
|-- data/                   # Data fallback lokal dan bank soal kuis
|-- lib/                    # Axios client dan helper data transform
|-- router/                 # Route table dan guard
|-- stores/                 # Pinia stores
|-- views/                  # Halaman route-level
|-- App.vue                 # RouterView root
`-- main.js                 # Bootstrap Vue, Pinia, Router
```

## File Penting

- `src/main.js`: membuat Vue app, memasang Pinia dan router.
- `src/router/index.js`: mendefinisikan semua route, auth guard, role guard, dan scroll behavior.
- `src/lib/api.js`: Axios instance dengan `baseURL` hardcoded `http://localhost:8000/api`, bearer token interceptor, 401 handling, dan helper snake_case ke camelCase.
- `src/stores/authStore.js`: login, register, logout, fetch user, update profil lokal.
- `src/stores/onboardingStore.js`: state pemahaman IT, minat, goal, note, dan submit onboarding.
- `src/stores/recommendationStore.js`: mengambil rekomendasi dari backend lalu flatten response rekomendasi.
- `src/stores/resourceStore.js`: daftar course, detail course, history, progress, skor kuis, CRUD resource admin, analytics, dan laporan video lokal.
- `src/stores/chatbotStore.js`: state percakapan dan request chatbot.
- `src/data/quizzes.js`: bank soal kuis dan resolver `getQuizByCategory`.
- `src/data/resources.js`: data dummy resource lama yang masih tersedia sebagai fallback/reference, tetapi sebagian besar view terbaru memakai API store.

## Routing dan Role

Route publik:

- `/`
- `/login`
- `/register`

Route user:

- `/dashboard`
- `/onboarding`
- `/reframing`
- `/interest-form`
- `/recommendation`
- `/resources/:id`
- `/profile`
- `/history`
- `/chatbot`

Route admin:

- `/admin/resources`
- `/admin/analytics`
- `/admin/settings`

Guard utama berada di `src/router/index.js`:

- Route dengan `meta.requiresAuth` membutuhkan `authStore.isAuthenticated`.
- Role user/admin dicek dari `authStore.user?.role`.
- User yang membuka route admin diarahkan ke `/dashboard`.
- Admin yang membuka route user diarahkan ke `/admin/resources`.
- User yang sudah login dan membuka `/`, `/login`, atau `/register` diarahkan sesuai role.

## Integrasi API

Semua request API memakai `src/lib/api.js`.

Base URL saat ini:

```js
http://localhost:8000/api
```

Token disimpan di `localStorage` dengan key `token`, lalu dikirim sebagai:

```txt
Authorization: Bearer <token>
```

Jika response `401`, client menghapus `token` dan `user` dari `localStorage`, lalu redirect ke `/login` kecuali sedang di `/login` atau `/`.

Endpoint yang dipakai kode:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /me`
- `POST /onboarding/complete`
- `GET /recommendations`
- `GET /courses`
- `GET /courses/history`
- `GET /courses/:id`
- `POST /courses/:id/progress`
- `POST /courses`
- `PUT /courses/:id`
- `DELETE /courses/:id`
- `GET /admin/analytics`
- `POST /chatbot`

## State dan Local Storage

Pinia store utama:

- `auth`: user, token, loading, error.
- `onboarding`: hasItKnowledge, interests, learningGoal, note.
- `recommendation`: recommendations, loading, error.
- `resource`: resources, history, currentResource, videoReports, loading, error.
- `chatbot`: messages, isLoading, error.

Local storage keys yang dipakai:

- `user`: profil user dari backend plus field tambahan lokal.
- `token`: bearer token API.
- `brainpath_auth`: key mock lama yang hanya dibersihkan saat logout.
- `video_reports`: laporan video lokal yang dipakai notifikasi admin.

## Konvensi Kode

- Pakai Composition API dan `<script setup>` untuk komponen Vue baru.
- Pakai alias `@/` untuk import dari `src`.
- Simpan request HTTP di store atau helper, bukan langsung tersebar di template.
- Normalisasi data backend di store agar komponen menerima bentuk data yang stabil.
- Komponen route-level ditempatkan di `src/views`.
- Komponen reusable ditempatkan sesuai domain di `src/components`.
- Gunakan Tailwind utility class seperti pola file existing.
- Jaga shape resource dalam camelCase di frontend, misalnya `externalUrl`, `durationText`, `learningPoints`, `aiSummary`.

## Pola Data Resource

Komponen frontend umumnya mengharapkan resource/course dengan field berikut:

```js
{
  id,
  title,
  description,
  category,
  level,
  duration,
  tags,
  externalUrl,
  source,
  relevanceScore,
  reason,
  summary,
  aiSummary,
  learningPoints,
  targetLearners,
  videoRoadmap,
  progress
}
```

Backend cenderung mengirim snake_case. Gunakan `convertKeysToCamelCase` dari `src/lib/api.js`, lalu `formatResource` di `resourceStore` jika data berasal dari endpoint course.

## Perhatian Teknis

- Role admin ditentukan client-side berdasarkan email `admin@brainpath.dev` di `authStore`. Ini hanya cocok sebagai bantuan UI, bukan otorisasi keamanan.
- `api.js` memakai base URL hardcoded. Jika environment bertambah, sebaiknya pindahkan ke `import.meta.env`.
- `recommendationStore` mengubah payload nested `{ course, similarity_score }` menjadi shape flat untuk `RecommendationCard`.
- `Recommendation.vue` memakai filter label UI `Frontend`, `Backend`, `Data`, `AI`, `Cybersecurity`, lalu memetakan beberapa label ke slug backend seperti `web-development`, `data-science`, dan `cybersecurity`.
- `AdminResources.vue` default form category masih memakai `Frontend`, tetapi option select memakai slug backend. Hati-hati saat menambah resource baru.
- `Profile.vue` dan `AdminSettings.vue` menyimpan nama/avatar hanya di localStorage melalui `authStore.updateUserProfile`, bukan ke backend.
- `VideoPreview.vue` dan `AdminTopNavbar.vue` memakai `video_reports` di localStorage untuk laporan video, bukan endpoint backend.
- `Chatbot.vue` menampilkan response dengan `v-html` setelah formatter markdown sederhana. Jangan masukkan HTML user-generated tanpa sanitasi tambahan jika sumber response berubah.
- Bank soal kuis di `src/data/quizzes.js` bersifat lokal. Skor disimpan via `/courses/:id/progress`.

## Workflow Perubahan

1. Baca route/view/store terkait sebelum mengubah komponen.
2. Jika menambah endpoint, tambahkan logic di store yang relevan dan normalisasi output di sana.
3. Jika menambah halaman, update `src/router/index.js` dan navigasi sidebar/navbar bila perlu.
4. Jika menambah field resource, update mapper di `resourceStore`, `recommendationStore`, dan komponen yang menampilkan field tersebut.
5. Jalankan minimal `npm run build` setelah perubahan besar.
6. Jalankan `npm run lint` hanya jika siap menerima auto-fix.

## Area yang Perlu Diperbaiki Jika Ada Waktu

- Pindahkan base API URL ke `.env`.
- Tambahkan test setup atau minimal smoke test build.
- Sinkronkan semua category agar konsisten antara label UI dan slug backend.
- Tambahkan sanitasi untuk HTML render di chatbot.
- Pindahkan update profil dan video report ke backend jika fitur ini ingin persistent lintas device.
- Hapus atau dokumentasikan penggunaan `src/data/resources.js` jika aplikasi sudah sepenuhnya API-driven.
