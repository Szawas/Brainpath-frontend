<template>
  <main class="min-h-screen bg-slate-50 text-slate-950">
    <AdminTopNavbar />

    <section class="mx-auto max-w-7xl px-5 py-6 lg:px-8">
      <div class="mb-7">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-950">Resource Management</h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Kelola resource belajar eksternal yang akan direkomendasikan oleh Brainpath.
          </p>
        </div>
      </div>

      <div class="mb-7 grid gap-5 md:grid-cols-3">
        <BaseCard
          v-for="stat in stats"
          :key="stat.title"
          padding="lg"
          class="rounded-3xl"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-slate-600">{{ stat.title }}</p>
              <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{{ stat.value }}</p>
            </div>
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-sm">
              <component :is="stat.icon" class="h-5 w-5" />
            </span>
          </div>
        </BaseCard>
      </div>

      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative max-w-sm flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari resource berdasarkan judul..."
            class="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      <AdminResourceTable 
        :resources="filteredResources" 
        @add="openForm()" 
        @edit="openForm($event)"
        @delete="handleDelete"
      />
    </section>

    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 py-8"
    >
      <BaseCard padding="lg" class="max-h-[90vh] w-full max-w-3xl overflow-y-auto">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-blue-600">Database</p>
            <h2 class="mt-2 text-2xl font-semibold text-slate-950">{{ isEditing ? 'Edit Resource' : 'Tambah Resource' }}</h2>
            <p class="mt-2 text-sm leading-6 text-slate-500">
              Perubahan akan disimpan langsung ke database PostgreSQL melalui Backend API.
            </p>
          </div>
          <button
            type="button"
            class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
            @click="showForm = false"
          >
            Tutup
          </button>
        </div>

        <form class="grid gap-5 md:grid-cols-2" @submit.prevent="handleSubmit">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-800" for="title">Title</label>
            <input id="title" v-model="formData.title" required :class="inputClass" placeholder="Contoh: HTML & CSS Dasar" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-800" for="url">External URL</label>
            <input id="url" v-model="formData.externalUrl" :class="inputClass" placeholder="https://youtube.com/..." />
          </div>

          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-800" for="description">Description</label>
            <textarea id="description" v-model="formData.description" rows="3" :class="textareaClass" placeholder="Deskripsi singkat resource" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-800" for="category">Category</label>
            <select id="category" v-model="formData.category" :class="inputClass">
              <option>Frontend</option>
              <option>Backend</option>
              <option>Data</option>
              <option>AI</option>
              <option>General IT</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-800" for="level">Level</label>
            <select id="level" v-model="formData.level" :class="inputClass">
              <option>Pemula</option>
              <option>Menengah</option>
              <option>Lanjutan</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-800" for="duration">Duration</label>
            <input id="duration" v-model="formData.duration" :class="inputClass" placeholder="45 menit" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-800" for="tags">Tags</label>
            <input id="tags" v-model="formData.tags" :class="inputClass" placeholder="HTML, CSS, Pemula" />
          </div>

          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-800" for="summary">AI Summary</label>
            <textarea id="summary" v-model="formData.summary" rows="3" :class="textareaClass" placeholder="Ringkasan AI singkat" />
          </div>

          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-slate-800" for="points">Learning Points</label>
            <textarea id="points" v-model="formData.points" rows="3" :class="textareaClass" placeholder="Poin belajar, pisahkan dengan koma atau baris baru" />
          </div>

          <div class="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
            <BaseButton type="button" variant="secondary" @click="showForm = false">
              Batal
            </BaseButton>
            <BaseButton type="submit">
              {{ isEditing ? 'Simpan Perubahan' : 'Simpan Resource' }}
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminResourceTable from '@/components/admin/AdminResourceTable.vue'
import AdminTopNavbar from '@/components/admin/AdminTopNavbar.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { useResourceStore } from '@/stores/resourceStore'
import { BarChart3, Layers, MousePointerClick } from 'lucide-vue-next'

const resourceStore = useResourceStore()

const showForm = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const formData = ref({
  id: null,
  title: '',
  externalUrl: '',
  description: '',
  category: 'Frontend',
  level: 'Pemula',
  duration: '',
  tags: '',
  summary: '',
  points: ''
})

const inputClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
const textareaClass =
  'w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'

const normalizeSource = (source) => {
  if (!source) return ''
  return source.split(' - ')[0]
}

const adminResources = computed(() => {
  const resources = resourceStore.resources || []
  return resources.map((resource) => ({
    ...resource,
    source: normalizeSource(resource.source),
  }))
})

const filteredResources = computed(() => {
  if (!searchQuery.value) return adminResources.value
  const query = searchQuery.value.toLowerCase()
  return adminResources.value.filter(r => r.title?.toLowerCase().includes(query))
})

const popularCategory = computed(() => {
  if (!adminResources.value.length) return 'Belum ada'
  const counts = adminResources.value.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1
    return acc
  }, {})
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
})

const stats = computed(() => [
  { title: 'Total Resource', value: adminResources.value.length, icon: Layers },
  { title: 'Total Klik Rekomendasi', value: '1,284', icon: MousePointerClick },
  { title: 'Kategori Terpopuler', value: popularCategory.value, icon: BarChart3 },
])

const openForm = (resource = null) => {
  if (resource) {
    isEditing.value = true
    formData.value = { 
      ...resource,
      tags: resource.tags?.join(', ') || '',
      points: resource.learningPoints?.join('\n') || ''
    }
  } else {
    isEditing.value = false
    formData.value = {
      id: null,
      title: '',
      externalUrl: '',
      description: '',
      category: 'Frontend',
      level: 'Pemula',
      duration: '',
      tags: '',
      summary: '',
      points: ''
    }
  }
  showForm.value = true
}

const handleSubmit = async () => {
  const submissionData = {
    ...formData.value,
    tags: formData.value.tags ? formData.value.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    learningPoints: formData.value.points ? formData.value.points.split('\n').map(s => s.trim()).filter(Boolean) : []
  }
  
  try {
    if (isEditing.value && formData.value.id) {
      await resourceStore.updateResource(formData.value.id, submissionData)
    } else {
      await resourceStore.addResource(submissionData)
    }
    showForm.value = false
  } catch (error) {
    alert('Gagal menyimpan data: ' + error.message)
  }
}

const handleDelete = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus resource ini secara permanen dari database?')) {
    try {
      await resourceStore.deleteResource(id)
    } catch (error) {
      alert('Gagal menghapus data: ' + error.message)
    }
  }
}

onMounted(() => {
  resourceStore.fetchResources()
})
</script>
