<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  students: Array
})

const emit = defineEmits(['view', 'edit', 'add', 'student-deleted'])

// Search functionality
const searchQuery = ref('')
const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) return props.students
  const query = searchQuery.value.toLowerCase()
  return props.students.filter(student =>
    // student.firstname.toLowerCase().includes(query) ||
    // student.lastname.toLowerCase().includes(query) ||
    // student.email.toLowerCase().includes(query) ||
    student.matric_no.toLowerCase().includes(query)
  )
})

// Event handlers
const handleView = (student) => {
  console.log('View student:', student)
  emit('view', student)
}

const handleEdit = (student) => {
  console.log('Edit student:', student)
  emit('edit', student)
}

const handleAdd = () => {
  console.log('Add student')
  emit('add')
}

const handleDelete = (student) => {
  console.log('Delete student:', student)
  // Just emit the event, let App.vue handle the modal confirmation
  emit('student-deleted', student)
}
</script>

<template>
  <div class="page">
    <h1>All Students</h1>

    <!-- ✅ DEBUG: Show received data info -->
    <div class="debug-table" v-if="false"> <!-- Set to true temporarily for debugging -->
      <p><strong>Table Debug:</strong></p>
      <p>Received students: {{ students }}</p>
      <p>Students count: {{ students.length }}</p>
      <p>Filtered count: {{ filteredStudents.length }}</p>
    </div>


    <div class="search-add-bar">
      <input v-model="searchQuery" type="text" placeholder="Search students by matriculation number"
        class="search-input" />
      <button @click="handleAdd" class="btn btn-success">
        Add Student
      </button>
    </div>

    <div v-if="filteredStudents.length === 0" class="no-data">
      <div v-if="searchQuery">
        No students found for "{{ searchQuery }}"
        <button @click="searchQuery = ''" class="btn-link">Clear search</button>
      </div>
      <div v-else>
        No students found.
        <button @click="handleAdd" class="btn-link">Add a student</button>
      </div>
    </div>

    <table v-else class="students-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Gender</th>
          <th>Email</th>
          <th>Matric Number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in filteredStudents" :key="student._id">
          <td>{{ student.firstname }}</td>
          <td>{{ student.lastname }}</td>
          <td>{{ student.gender }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.matric_no }}</td>
          <td class="actions">
            <button @click="handleView(student)" class="btn btn-primary">
              View
            </button>
            <button @click="handleEdit(student)" class="btn btn-warning">
              Edit
            </button>
            <button @click="handleDelete(student)" class="btn btn-danger">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.page {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-add-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  max-width: 400px;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.students-table th,
.students-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.students-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.students-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.students-table tr:hover {
  background-color: #f1f1f1;
}

.actions {
  display: flex;
  gap: 8px;
}

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

.btn-success {
  background-color: #2ecc71;
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

.btn-link {
  background: none;
  border: none;
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.btn-link:hover {
  color: #2980b9;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #777;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.debug-table {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
