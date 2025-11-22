<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { studentService } from '@/services/studentService'

const props = defineProps({
  student: Object
})

const emit = defineEmits(['saved', 'cancel'])

const form = ref({
  firstname: '',
  lastname: '',
  gender: '',
  email: '',
  matric_no: ''
})

const loading = ref(false)
const error = ref('')

const isEdit = computed(() => !!props.student)

// Examples only for add mode
const fieldExamples = {
  firstname: 'e.g., John, Mary, Chiamaka',
  lastname: 'e.g., Smith, Johnson, Adebayo', email: 'e.g., name@example.com',
  matric_no: 'e.g., ADUN/FS/SEN/23/040'
}

const resetForm = () => {
  form.value = {
    firstname: '',
    lastname: '',
    gender: '',
    email: '',
    matric_no: ''
  }
}

const initializeForm = () => {
  if (props.student && props.student._id) {
    form.value = {
      firstname: props.student.firstname || '',
      lastname: props.student.lastname || '',
      gender: props.student.gender || '',
      email: props.student.email || '',
      matric_no: props.student.matric_no || ''
    }
  } else {
    resetForm()
  }
}

onMounted(() => {
  initializeForm()
})

watch(() => props.student, (newStudent) => {
  if (newStudent && newStudent._id) {
    initializeForm()
  }
}, { deep: true })

const submit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (isEdit.value) {
      await studentService.updateStudent(props.student._id, form.value)
    } else {
      await studentService.createStudent(form.value)
    }
    emit('saved')
  } catch (err) {
    if (err.message.includes('too long')) {
      emit('saved')
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h1>{{ isEdit ? 'Edit Student' : 'Add New Student' }}</h1>

    <div v-if="isEdit && student" class="editing-info">
      <strong>Editing:</strong> {{ student.firstname }} {{ student.lastname }} ({{ student.matric_no }})
    </div>

    <form @submit.prevent="submit" class="student-form">
      <!-- First Name -->
      <div class="form-group">
        <label>First Name *</label>
        <input v-model="form.firstname" type="text" required :disabled="loading"
          :placeholder="isEdit ? 'First name' : `Enter student's first name`">
        <!-- ✅ Show example in add mode, current value in edit mode -->
        <div v-if="!isEdit" class="example-text">{{ fieldExamples.firstname }}</div>
        <div v-else class="current-value">Current: "{{ student.firstname }}"</div>
      </div>

      <!-- Last Name -->
      <div class="form-group">
        <label>Last Name *</label>
        <input v-model="form.lastname" type="text" required :disabled="loading"
          :placeholder="isEdit ? 'Last name' : `Enter student's last name`">
        <div v-if="!isEdit" class="example-text">{{ fieldExamples.lastname }}</div>
        <div v-else class="current-value">Current: "{{ student.lastname }}"</div>
      </div>

      <!-- Gender -->
      <div class="form-group">
        <label>Gender *</label>
        <select v-model="form.gender" required :disabled="loading">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Gay">Gay</option>
        </select>
        <div v-if="!isEdit" class="example-text">Choose from: Male, Female, or Gay</div>
        <div v-else class="current-value">Current: "{{ student.gender }}"</div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label>Email *</label>
        <input v-model="form.email" type="email" required :disabled="loading"
          :placeholder="isEdit ? 'Email address' : `Enter student's email address`">
        <div v-if="!isEdit" class="example-text">{{ fieldExamples.email }}</div>
        <div v-else class="current-value">Current: "{{ student.email }}"</div>
      </div>

      <!-- Matric Number -->
      <div class="form-group">
        <label>Matric Number *</label>
        <input v-model="form.matric_no" type="text" required :disabled="loading"
          :placeholder="isEdit ? 'Matric number' : 'Enter matriculation number'">
        <!-- ✅ Show examples and format hint only in add mode -->
        <div v-if="!isEdit" class="example-text">{{ fieldExamples.matric_no }}</div>
        <div v-if="!isEdit" class="format-hint">
          Format: ADUN/Faculty/Department/Year/Number
        </div>
        <div v-else class="current-value">Current: "{{ student.matric_no }}"</div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn btn-success">
          {{ loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student') }}
        </button>
        <button type="button" @click="emit('cancel')" :disabled="loading" class="btn btn-primary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.editing-info {
  background: #e8f4fd;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #3498db;
}

.student-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #333;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* ✅ Example text styling (only shown in add mode) */
.example-text {
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 0.25rem;
}

/* ✅ Current value styling (only shown in edit mode) */
.current-value {
  color: #2ecc71;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

/* ✅ Format hint for matric number (only shown in add mode) */
.format-hint {
  color: #e67e22;
  font-size: 0.8rem;
  font-weight: 500;
  background: #fef9e7;
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #f39c12;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success {
  background: #2ecc71;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #27ae60;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}
</style>
