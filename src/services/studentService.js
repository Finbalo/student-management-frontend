import axios from 'axios'
import { API_BASE_URL } from '@/config/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Optional: Global loading state
let activeRequests = 0

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    activeRequests++
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`, config.data)

    // // You could emit a global loading event here if needed
    // emit('loading-start')

    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    activeRequests--
    console.log('✅ Response received:', response.status, response.data)

    // If no more active requests, loading is complete
    if (activeRequests === 0) {
      // emit('loading-end')
    }

    return response
  },
  (error) => {
    activeRequests--

    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    })

    let errorMessage = 'An unexpected error occurred'

    if (error.code === 'ECONNABORTED') {
      errorMessage =
        'Request took too long. The student may have been created/updated but the response timed out. Please check the list.'
    } else if (error.message === 'Network Error') {
      errorMessage = 'Cannot connect to server. Please check if the backend is running.'
    } else if (!error.response) {
      errorMessage = 'Network error - please check your connection'
    } else if (error.response.status === 400) {
      if (error.response.data?.errors) {
        const fieldErrors = Object.values(error.response.data.errors).flat()
        errorMessage = `Validation error: ${fieldErrors.join(', ')}`
      } else {
        errorMessage = error.response.data?.message || 'Invalid data provided'
      }
    } else if (error.response.status === 404) {
      errorMessage = 'Resource not found'
    } else if (error.response.status === 500) {
      errorMessage = error.response.data?.message || 'Server error - please check backend console'
    } else if (error.response.data?.message) {
      errorMessage = error.response.data.message
    }

    return Promise.reject(new Error(errorMessage))
  },
)

export const studentService = {
  async getStudents() {
    const response = await apiClient.get('/students')
    console.log('📊 getStudents response structure:', response.data)

    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    } else if (response.data && response.data.data && typeof response.data.data === 'object') {
      return [response.data.data]
    } else {
      console.warn('⚠️ Unexpected response structure:', response.data)
      return []
    }
  },

  async getStudent(id) {
    const response = await apiClient.get(`/students/${id}`)
    return response.data.data || response.data
  },

  async createStudent(studentData) {
    const response = await apiClient.post('/students', studentData)
    return response.data.data || response.data
  },

  async updateStudent(id, studentData) {
    const response = await apiClient.put(`/students/${id}`, studentData)
    return response.data.data || response.data
  },

  async deleteStudent(id) {
    const response = await apiClient.delete(`/students/${id}`)
    return response.data.data || response.data
  },
}
