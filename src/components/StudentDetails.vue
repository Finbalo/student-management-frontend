<script setup>
const props = defineProps({
  student: Object
})

const emit = defineEmits(['edit', 'delete', 'back'])

// ✅ FIX: Remove the direct delete handling and just emit the event
const handleEdit = () => {
  console.log('📝 Edit button clicked in StudentDetails for:', props.student)
  emit('edit', props.student)
}

// ✅ FIX: Just emit the delete event, let App.vue handle the modal
const handleDelete = () => {
  console.log('🗑️ Delete button clicked in StudentDetails for:', props.student)
  emit('delete') // App.vue will show the modal
}
</script>

<template>
  <div class="page-card">
    <h1>Student Details</h1>
    <div v-if="student" class="student-details">
      <div class="detail-row">
        <div class="detail-label">First Name:</div>
        <div class="detail-value">{{ student.firstname }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Last Name:</div>
        <div class="detail-value">{{ student.lastname }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Gender:</div>
        <div class="detail-value">{{ student.gender }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Email:</div>
        <div class="detail-value">{{ student.email }}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Matric Number:</div>
        <div class="detail-value">{{ student.matric_no }}</div>
      </div>
    </div>
    <div class="action-buttons">
      <button class="btn btn-primary" @click="emit('back')">Back to List</button>
      <button class="btn btn-warning" @click="handleEdit">Edit</button>
      <!-- ✅ FIX: Use handleDelete instead of direct emit -->
      <button class="btn btn-danger" @click="handleDelete">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.page-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.student-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.detail-label {
  font-weight: bold;
  width: 150px;
}

.detail-value {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
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
</style>
