<template>
  <div class="auth-selection-page flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
    <h1 class="text-4xl font-bold mb-4 text-center">Ласкаво просимо у персональний трекер задач</h1>
    <p class="text-xl mb-6 text-gray-700 text-center">Будь ласка, виберіть дію для продовження</p>
    <div class="flex flex-col space-y-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <button @click="goToRegister" class="p-4 text-lg cursor-pointer text-white rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-green-500 hover:bg-green-600">Реєстрація</button>
      <button @click="goToLogin" class="p-4 text-lg cursor-pointer text-white rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105 bg-blue-500 hover:bg-blue-600">Авторизація</button>
    </div>
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