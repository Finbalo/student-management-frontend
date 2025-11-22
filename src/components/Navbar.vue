<script setup>
// ✅ Define props properly
defineProps({
  currentView: String
})

const emit = defineEmits(['navigate'])

const handleNavigation = (view) => {
  console.log('NavBar: Navigating to', view)
  emit('navigate', view)
}
</script>

<template>
  <header>
    <nav class="nav">
      <div class="logo">Student Management System</div>
      <ul class="nav-links">
        <li>
          <a href="#" :class="{ active: currentView === 'list' }" @click.prevent="handleNavigation('list')">
            View Students
          </a>
        </li>
        <li>
          <a href="#" :class="{ active: currentView === 'add' }" @click.prevent="handleNavigation('add')">
            Add Student
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: #34495e;
}
</style>
