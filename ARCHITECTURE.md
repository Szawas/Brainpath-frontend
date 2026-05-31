# ARCHITECTURE.md

Dokumentasi arsitektur Brainpath Frontend berdasarkan kondisi kode saat ini.

## Tujuan Arsitektur

Frontend Brainpath berperan sebagai Single Page Application yang:

- Mengelola pengalaman pengguna dari landing sampai rekomendasi kursus.
- Mengambil data autentikasi, onboarding, course, rekomendasi, progress, analytics, dan chatbot dari backend API.
- Menormalisasi response backend agar komponen Vue menerima shape data yang stabil.
- Menyediakan fallback UI dan fallback data lokal untuk quiz, target learner, roadmap, dan beberapa dummy resource.

## Stack dan Runtime

- Runtime: browser SPA.
- Framework: Vue 3.
- Build tool: Vite.
- Router: Vue Router.
- State: Pinia.
- HTTP: Axios.
- Styling: Tailwind CSS v4.
- UI helpers: Lucide Vue Next, SweetAlert2.
- Tooling: ESLint, Oxlint, Prettier.

`vite.config.js` memasang plugin:

- `@vitejs/plugin-vue`
- `vite-plugin-vue-devtools`
- `@tailwindcss/vite`

Alias path:

```js
'@': './src'
```

## Bootstrap Aplikasi

Entrypoint:

```txt
index.html
  -> src/main.js
    -> createApp(App)
    -> app.use(createPinia())
    -> app.use(router)
    -> app.mount('#app')
```

`src/App.vue` hanya merender:

```vue
<RouterView />
```

Artinya layout global tidak berada di root. Setiap view menentukan sendiri apakah memakai navbar publik, sidebar user, atau navbar admin.

## Layer Arsitektur

```txt
View Layer
  src/views/*.vue
  Mengatur layout halaman, lifecycle, UI state lokal, dan komposisi komponen.

Component Layer
  src/components/**/*.vue
  Komponen reusable dan domain-specific.

State Layer
  src/stores/*.js
  Pinia store untuk auth, onboarding, recommendation, resource, dan chatbot.

API Layer
  src/lib/api.js
  Axios instance, token interceptor, global error handling, key conversion helper.

Data Fallback Layer
  src/data/resources.js
  src/data/quizzes.js
  Data dummy lama dan bank soal kuis lokal.
```

## Routing Architecture

Route table berada di `src/router/index.js` dan memakai `createWebHistory(import.meta.env.BASE_URL)`.

Public routes:

| Path | View | Keterangan |
| --- | --- | --- |
| `/` | `Landing.vue` | Landing page publik |
| `/login` | `Login.vue` | Login user/admin |
| `/register` | `Register.vue` | Registrasi user |

User routes:

| Path | View | Keterangan |
| --- | --- | --- |
| `/dashboard` | `Dashboard.vue` | Ringkasan user dan rekomendasi terakhir |
| `/onboarding` | `Onboarding.vue` | Pertanyaan pemahaman IT |
| `/reframing` | `Reframing.vue` | Edukasi bidang IT |
| `/interest-form` | `InterestForm.vue` | Kuis minat dan tujuan belajar |
| `/recommendation` | `Recommendation.vue` | Daftar rekomendasi |
| `/resources/:id` | `ResourcePreview.vue` | Detail resource, preview, quiz |
| `/profile` | `Profile.vue` | Profil user |
| `/history` | `History.vue` | Riwayat belajar |
| `/chatbot` | `Chatbot.vue` | Asisten AI berbasis course |

Admin routes:

| Path | View | Keterangan |
| --- | --- | --- |
| `/admin/resources` | `AdminResources.vue` | CRUD resource |
| `/admin/analytics` | `AdminAnalytics.vue` | Analytics platform |
| `/admin/settings` | `AdminSettings.vue` | Settings admin |

Route guard:

```txt
requiresAuth && !authStore.isAuthenticated
  -> redirect /login?redirect=<target>

authenticated user opens public page
  -> admin: /admin/resources
  -> user: /dashboard

route meta role mismatch
  -> admin: /admin/resources
  -> user: /dashboard
```

Scroll behavior:

- Hash route scroll ke element dengan offset `top: 112`.
- Route normal scroll ke top dengan smooth behavior.

## API Architecture

API client berada di `src/lib/api.js`.

Konfigurasi:

```js
axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})
```

Request interceptor:

- Membaca token dari `localStorage.getItem('token')`.
- Menambahkan `Authorization: Bearer <token>` jika token ada.

Response interceptor:

- Jika status `401`, hapus `token` dan `user`, lalu redirect ke `/login`.
- Jika status selain `401` dan `422`, tampilkan SweetAlert2 warning untuk gangguan koneksi/server.

Helper transform:

- `snakeToCamel(str)`.
- `convertKeysToCamelCase(obj)`, rekursif untuk object dan array.

## Endpoint Dependency

Auth:

| Method | Endpoint | Store |
| --- | --- | --- |
| `POST` | `/auth/login` | `authStore.login` |
| `POST` | `/auth/register` | `authStore.register` |
| `POST` | `/auth/logout` | `authStore.logout` |
| `GET` | `/me` | `authStore.fetchUser` |

Onboarding:

| Method | Endpoint | Store |
| --- | --- | --- |
| `POST` | `/onboarding/complete` | `onboardingStore.completeOnboarding` |

Recommendation:

| Method | Endpoint | Store |
| --- | --- | --- |
| `GET` | `/recommendations` | `recommendationStore.fetchRecommendations` |

Course/resource:

| Method | Endpoint | Store |
| --- | --- | --- |
| `GET` | `/courses` | `resourceStore.fetchResources` |
| `GET` | `/courses/history` | `resourceStore.fetchHistory` |
| `GET` | `/courses/:id` | `resourceStore.fetchResourceById` |
| `POST` | `/courses/:id/progress` | `resourceStore.trackProgress`, `resourceStore.saveQuizScore` |
| `POST` | `/courses` | `resourceStore.addResource` |
| `PUT` | `/courses/:id` | `resourceStore.updateResource` |
| `DELETE` | `/courses/:id` | `resourceStore.deleteResource` |

Admin:

| Method | Endpoint | Store |
| --- | --- | --- |
| `GET` | `/admin/analytics` | `resourceStore.fetchAnalytics` |

Chatbot:

| Method | Endpoint | Store |
| --- | --- | --- |
| `POST` | `/chatbot` | `chatbotStore.sendMessage` |

## State Architecture

### Auth Store

File: `src/stores/authStore.js`

State:

- `user`
- `token`
- `loading`
- `error`

Getters:

- `isAuthenticated`
- `hasRole(role)`
- `isAdmin`

Actions:

- `login(email, password)`
- `register(name, email, password, password_confirmation)`
- `logout()`
- `fetchUser()`
- `updateUserProfile(name, avatar)`

Responsibilities:

- Persist auth state ke localStorage.
- Derive role dari email `admin@brainpath.dev`.
- Update nama/avatar lokal.

### Onboarding Store

File: `src/stores/onboardingStore.js`

State:

- `hasItKnowledge`
- `interests`
- `learningGoal`
- `note`
- `loading`
- `error`

Actions:

- `setKnowledge(value)`
- `setInterests(interests)`
- `setGoalAndNote(goal, note)`
- `completeOnboarding()`

Responsibilities:

- Menyimpan state onboarding antar halaman.
- Submit hasil onboarding ke backend.
- Meminta auth store refresh user setelah onboarding selesai.

### Recommendation Store

File: `src/stores/recommendationStore.js`

State:

- `recommendations`
- `loading`
- `error`

Action:

- `fetchRecommendations()`

Responsibilities:

- Mengambil rekomendasi dari backend.
- Mengubah payload nested menjadi resource flat.
- Parse `tags` dari array, JSON string, atau comma-separated string.
- Menghitung `relevanceScore` dari `similarity_score`.
- Mengambil source label dari external URL.

### Resource Store

File: `src/stores/resourceStore.js`

State:

- `resources`
- `history`
- `currentResource`
- `videoReports`
- `loading`
- `error`

Actions:

- `fetchResources()`
- `fetchHistory()`
- `fetchResourceById(id)`
- `trackProgress(id)`
- `saveQuizScore(id, score)`
- `addResource(resourceData)`
- `updateResource(id, updatedData)`
- `deleteResource(id)`
- `fetchAnalytics()`
- `submitVideoReport(courseId, courseTitle, issueType, details)`
- `deleteVideoReport(reportId)`

Responsibilities:

- Menjadi store utama untuk course/resource.
- Normalisasi snake_case backend menjadi camelCase.
- Format `tags`, `learningPoints`, `duration`, `source`, `aiSummary`, `targetLearners`, dan `videoRoadmap`.
- Menyimpan video reports lokal ke localStorage.
- Mengirim custom event `new-video-report` dan `delete-video-report` untuk sinkronisasi notifikasi admin.

### Chatbot Store

File: `src/stores/chatbotStore.js`

State dengan setup store:

- `messages`
- `isLoading`
- `error`

Actions:

- `sendMessage(question, courseId)`
- `clearChat()`

Responsibilities:

- Menjaga daftar pesan user dan AI.
- Mengirim pertanyaan ke backend dengan konteks course.
- Menambahkan pesan error sebagai bubble AI jika request gagal.

### Counter Store

File: `src/stores/counter.js`

Store bawaan template. Tidak dipakai oleh fitur aplikasi saat ini.

## Data Flow Utama

### Auth Flow

```txt
Login.vue/Register.vue
  -> authStore.login/register
    -> api.post('/auth/login' atau '/auth/register')
      -> simpan user dan token ke Pinia + localStorage
        -> router push sesuai role
```

### Protected Route Flow

```txt
User membuka protected route
  -> router.beforeEach
    -> useAuthStore()
      -> cek token dan role
        -> allow atau redirect
```

### Onboarding Flow

```txt
Onboarding.vue
  -> setKnowledge(true/false)
    -> true: InterestForm.vue
    -> false: Reframing.vue -> InterestForm.vue

InterestForm.vue
  -> setInterests()
  -> setGoalAndNote()
  -> completeOnboarding()
    -> POST /onboarding/complete
    -> authStore.fetchUser()
    -> /recommendation
```

### Recommendation Flow

```txt
Recommendation.vue/Dashboard.vue
  -> recommendationStore.fetchRecommendations()
    -> GET /recommendations
    -> flatten course + similarity_score
    -> render card/list
```

### Resource Preview Flow

```txt
ResourcePreview.vue mounted
  -> resourceStore.fetchResourceById(route.params.id)
    -> GET /courses/:id
    -> formatResource()
    -> render preview
  -> resourceStore.trackProgress(id)
    -> POST /courses/:id/progress { status: 'in_progress' }

Submit quiz
  -> calculate score
  -> resourceStore.saveQuizScore(id, score)
    -> POST /courses/:id/progress { status: 'completed', score }
```

### Admin Resource Flow

```txt
AdminResources.vue mounted
  -> resourceStore.fetchResources()
    -> GET /courses
    -> render table

Add/Edit/Delete
  -> resourceStore.addResource/updateResource/deleteResource
    -> POST/PUT/DELETE /courses
    -> update local state
```

### Chatbot Flow

```txt
Chatbot.vue mounted
  -> resourceStore.fetchResources()
    -> user selects course
      -> chatbotStore.sendMessage(question, courseId)
        -> POST /chatbot
        -> append AI answer
```

## Resource Data Model

Frontend canonical shape:

```js
{
  id: 1,
  title: 'HTML & CSS Dasar',
  description: '...',
  category: 'web-development',
  level: 'Pemula',
  duration: '45 menit',
  tags: ['HTML', 'CSS'],
  externalUrl: 'https://...',
  source: 'YouTube',
  relevanceScore: 96,
  reason: '...',
  summary: '...',
  aiSummary: '...',
  learningPoints: ['...'],
  targetLearners: ['...'],
  videoRoadmap: [
    { title: '...', time: '00:00 - 05:30' }
  ],
  progress: {
    status: 'in_progress',
    score: 80
  }
}
```

Backend payload cenderung memakai snake_case:

```js
{
  external_url,
  duration_text,
  duration_minutes,
  learning_points,
  similarity_score
}
```

Transform dilakukan di:

- `convertKeysToCamelCase` untuk course API umum.
- Mapper internal `formatResource` di `resourceStore`.
- Mapper internal di `recommendationStore.fetchRecommendations`.

## UI Architecture

Layout tidak global, tetapi dipilih per view:

- Public pages memakai `AppNavbar` atau header sederhana.
- User pages memakai `AppSidebar`.
- Admin pages memakai `AdminTopNavbar`.

Reusable components menjaga styling konsisten:

- Base primitives: `BaseButton`, `BaseCard`, `IconBox`, `EmptyState`, `StepProgress`, `SummaryCard`.
- Domain components: recommendation, onboarding, resource, admin.

Styling global:

- `src/assets/main.css` mengimpor Tailwind.
- Menurunkan base font size desktop ke `14px` pada `min-width: 768px`.
- Mengaktifkan smooth scroll dan transition default untuk interactive elements.
- Menyediakan utility `.hover-premium`.

## Authorization Model

Frontend authorization hanya UI guard:

- `authStore.isAuthenticated` berarti token ada.
- Role berasal dari `authStore.user.role`.
- `authStore` memaksa role admin jika email adalah `admin@brainpath.dev`.

Backend tetap wajib:

- Memvalidasi bearer token.
- Menegakkan role admin untuk endpoint admin dan CRUD resource.
- Tidak bergantung pada role hasil manipulasi client.

## Persistence Model

Persistent di backend:

- User auth token/session.
- Onboarding result.
- Recommendations.
- Courses/resources.
- Course history/progress.
- Quiz score via progress endpoint.
- Admin analytics.
- Chatbot response.

Persistent lokal browser:

- `user`.
- `token`.
- `video_reports`.
- Avatar Base64 dan nama hasil update profil lokal.

UI-only:

- Recommendation rules admin settings.
- Beberapa statistik di `AdminResources.vue`, seperti total klik rekomendasi.

## Error Handling

Global:

- Axios response interceptor menangani `401` dan gangguan koneksi/server umum.

Per store:

- Store menyimpan `loading` dan `error`.
- View menampilkan loading, error, atau empty state sesuai kebutuhan.

Dialog:

- SweetAlert2 dipakai untuk validasi upload avatar, success CRUD, error CRUD, dan konfirmasi delete/logout.

## Build dan Quality

Build:

```sh
npm run build
```

Lint:

```sh
npm run lint
```

Format:

```sh
npm run format
```

Tidak ada test runner atau script test saat ini.

## Arsitektur yang Perlu Dirapikan

- Pindahkan `baseURL` API ke environment variable.
- Konsistenkan category di seluruh app menjadi slug backend atau label UI, jangan campur.
- Hilangkan role derivation client-side untuk admin, atau setidaknya jadikan hanya display hint.
- Tambahkan sanitasi HTML untuk chatbot jika tetap memakai `v-html`.
- Pindahkan avatar/profile update dan video report ke backend jika fitur harus tersimpan lintas device.
- Tambahkan test minimal untuk mapper store dan route guard.
- Pisahkan helper `formatResource` dan `_extractSource` ke utility bersama karena saat ini logic mirip ada di beberapa file.
- Evaluasi apakah `src/data/resources.js` masih diperlukan jika semua resource sudah berasal dari API.
