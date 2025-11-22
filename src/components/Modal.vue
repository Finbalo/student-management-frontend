<script setup>
defineProps({
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  show: Boolean,
  type: { type: String, default: 'confirm' } // ✅ Add type: 'confirm', 'success', 'error'
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay" @click="$emit('cancel')">
      <div class="modal" @click.stop :class="type">
        <div class="modal-icon" v-if="type !== 'confirm'">
          <span v-if="type === 'success'">✅</span>
          <span v-else-if="type === 'error'">❌</span>
        </div>
        <h3>{{ title }}</h3>
        <p v-html="message"></p>
        <div class="modal-actions">
          <button v-if="type === 'confirm'" class="btn btn-danger" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
          <button v-else class="btn btn-success" @click="$emit('confirm')">
            OK
          </button>
          <button v-if="type === 'confirm'" class="btn btn-primary" @click="$emit('cancel')">
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* ✅ Success modal styling */
.modal.success {
  border-top: 4px solid #2ecc71;
}

/* ✅ Error modal styling */
.modal.error {
  border-top: 4px solid #e74c3c;
}

/* ✅ Confirm modal styling */
.modal.confirm {
  border-top: 4px solid #3498db;
}

.modal-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.modal h3 {
  margin: 0 0 1rem;
  color: #2c3e50;
}

.modal p {
  margin-bottom: 1.5rem;
  color: #555;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
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
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-success {
  background-color: #2ecc71;
  color: white;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}
</style>
