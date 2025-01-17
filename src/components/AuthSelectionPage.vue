<template>
  <div class="auth-selection-page flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-4">Ласкаво просимо у персональний трекер задач</h1>
    <p class="text-xl mb-6 text-gray-700">Будь ласка, виберіть дію для продовження</p>
    <button @click="goToRegister" class="m-2 p-4 text-lg cursor-pointer text-white rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-green-500 hover:bg-green-600">Реєстрація</button>
    <button @click="goToLogin" class="m-2 p-4 text-lg cursor-pointer text-white rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-blue-500 hover:bg-blue-600">Авторизація</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}

const goToLogin = () => {
  router.push('/login')
}
</script>