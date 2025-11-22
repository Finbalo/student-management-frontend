<script setup>
import { ref, onMounted } from 'vue'
import { studentService } from '@/services/studentService'
import StudentTable from '@/components/StudentTable.vue'
import StudentForm from '@/components/StudentForm.vue'
import StudentDetails from '@/components/StudentDetails.vue'
import Modal from '@/components/Modal.vue'
import Navbar from '@/components/Navbar.vue'

const currentView = ref('list')
const students = ref([])
const selectedStudent = ref(null)
const loading = ref(false)

// Enhanced modal state
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'confirm', // 'confirm', 'success', 'error'
  onConfirm: null,
  onCancel: null
})

// Show modal function (enhanced)
const showModalMessage = (title, message, type = 'confirm', onConfirm = null, onCancel = null) => {
  modalConfig.value = {
    title,
    message,
    type,
    confirmText: type === 'confirm' ? 'Yes, Delete' : 'OK',
    cancelText: 'Cancel',
    onConfirm,
    onCancel
  }
  showModal.value = true
}

// Hide modal function
const hideModal = () => {
  showModal.value = false
}

// Show success messages
const showSuccessMessage = (message, autoClose = true) => {
  showModalMessage('Success!', message, 'success', () => {
    hideModal()
  })

  // Auto close success messages after 2 seconds
  if (autoClose) {
    setTimeout(() => {
      hideModal()
    }, 2000)
  }
}

// Handle navigation from Navbar
const handleNavigation = (view) => {
  console.log('Navigating to:', view)
  if (view === 'list' || view === 'add') {
    testView(view)
  }
}

// Test function - manually switch views
const testView = (view, student = null) => {
  console.log('Switching to:', view, 'Student:', student)
  currentView.value = view
  selectedStudent.value = student
}

// Load students
const loadStudents = async () => {
  loading.value = true
  try {
    students.value = await studentService.getStudents()
  } catch (error) {
    console.error('Failed to load students:', error)
    students.value = []
  } finally {
    loading.value = false
  }
}

// Handle events from StudentTable
const handleViewStudent = (student) => {
  testView('details', student)
}

const handleEditStudent = (student) => {
  testView('edit', student)
}

const handleAddStudent = () => {
  testView('add')
}

// Handle delete with modal confirmation
const handleStudentDeleted = (student) => {
  showModalMessage(
    'Delete Student',
    `Are you sure you want to delete <strong>${student.firstname} ${student.lastname}</strong>? This action cannot be undone.`,
    'confirm',
    async () => {
      try {
        console.log('Deleting student:', student)
        await studentService.deleteStudent(student._id)
        await loadStudents()

        // Show success message
        showSuccessMessage(`Student <strong>${student.firstname} ${student.lastname}</strong> has been deleted successfully!`)

        // If we're viewing the deleted student, go back to list
        if (currentView.value === 'details' && selectedStudent.value?._id === student._id) {
          testView('list')
        }
      } catch (error) {
        console.error('Delete failed:', error)
        showModalMessage('Error', `Failed to delete student: ${error.message}`, 'error')
      }
    },
    () => {
      console.log('Delete cancelled')
    }
  )
}

// Handle delete from StudentDetails
const handleDeleteFromDetails = () => {
  if (selectedStudent.value) {
    handleStudentDeleted(selectedStudent.value)
  }
}

// Handle back from StudentDetails
const handleBackFromDetails = () => {
  testView('list')
}

// Handle form success with messages
const handleStudentSaved = (action = 'added') => {
  loadStudents()
  testView('list')

  // Show success message based on action
  if (selectedStudent.value && action === 'updated') {
    showSuccessMessage(`Student <strong>${selectedStudent.value.firstname} ${selectedStudent.value.lastname}</strong> has been updated successfully!`)
  } else if (action === 'added') {
    showSuccessMessage('New student has been added successfully!')
  }
}

// Handle form cancel with proper cleanup
const handleCancel = () => {
  testView('list')
  selectedStudent.value = null
}

onMounted(() => {
  loadStudents()
})
</script>

<template>
  <div class="app">
    <Navbar :current-view="currentView" @navigate="handleNavigation" />

    <div class="container">
      <div v-if="loading" class="loading">
        Loading students...
      </div>

      <div v-else-if="currentView === 'list'">
        <StudentTable :students="students" @view="handleViewStudent" @edit="handleEditStudent" @add="handleAddStudent"
          @student-deleted="handleStudentDeleted" />
      </div>

      <div v-else-if="currentView === 'add'">
        <!-- Pass success handler to form -->
        <StudentForm @saved="() => handleStudentSaved('added')" @cancel="handleCancel" />
      </div>

      <div v-else-if="currentView === 'edit'">
        <!-- Pass success handler to form -->
        <StudentForm :student="selectedStudent" @saved="() => handleStudentSaved('updated')" @cancel="handleCancel" />
      </div>

      <div v-else-if="currentView === 'details'">
        <StudentDetails :student="selectedStudent" @edit="handleEditStudent" @delete="handleDeleteFromDetails"
          @back="handleBackFromDetails" />
      </div>

      <div v-else class="error">
        Unknown view: {{ currentView }}
      </div>
    </div>

    <!-- Modal Component -->
    <Modal :title="modalConfig.title" :message="modalConfig.message" :confirm-text="modalConfig.confirmText"
      :cancel-text="modalConfig.cancelText" :show="showModal" :type="modalConfig.type" @confirm="modalConfig.onConfirm"
      @cancel="modalConfig.onCancel || hideModal()" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

.app {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Student count info */
.student-count-info {
  background: #e8f4fd;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border-left: 4px solid #3498db;
  font-weight: bold;
}

/* Loading and Error States */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error {
  text-align: center;
  padding: 40px;
  color: #e74c3c;
  background: #f8d7da;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
}

/* Button Styles */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-warning {
  background-color: #f39c12;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-success {
  background-color: #2ecc71;
  color: white;
}
</style>
