<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold mb-4 text-center">Авторизація</h1>
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
            >Логін</label
          >
          <input
            v-model="username"
            type="text"
            id="username"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
            >Пароль</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            :class="{ 'border-red-500': passwordError }"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <p v-if="passwordError" class="text-red-500 text-xs italic">
            {{ passwordError }}
          </p>
        </div>
        <button
          type="submit"
          :disabled="!isFormValid"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Увійти
        </button>
      </form>
      <button
        @click="goToRegister"
        class="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Перейти до реєстрації
      </button>
    </div>
  </div>
  <div
    v-if="showLoginErrorModal"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10"
  >
    <div
      class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal"
    >
      <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Помилка</h2>
      <p class="text-center font-bold text-gray-700 mb-6">
        Неправильний логін або пароль
      </p>
      <div class="flex gap-6 justify-center">
        <button
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
          @click="closeLoginErrorModal"
        >
          Закрити
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";

const username = ref("");
const password = ref("");
const router = useRouter();

const passwordError = computed(() => {
  return password.value && password.value.length < 5
    ? "Пароль повинен містити мінімум 5 символів"
    : "";
});

const isFormValid = computed(() => {
  return username.value && password.value && !passwordError.value;
});

const showLoginErrorModal = ref(false);

const login = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((user) => user.username === username.value);

  if (user) {
    const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword === password.value) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id: user.id, username: user.username })
      );
      router.push("/home");
      return;
    }
  }
  showLoginErrorModal.value = true;
};

const closeLoginErrorModal = () => {
  showLoginErrorModal.value = false;
};

const goToRegister = () => {
  router.push("/register");
};
</script>
