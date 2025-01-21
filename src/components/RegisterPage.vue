<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
    <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold mb-4 text-center">Реєстрація</h1>
      <form @submit.prevent="register" class="space-y-6">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Пошта</label>
          <input v-model="email" type="email" id="email"
            :class="{ 'border-red-500': emailError || emailExistsError }"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
          <p v-if="emailError" class="text-red-500 text-xs italic">{{ emailError }}</p>
          <p v-if="emailExistsError" class="text-red-500 text-xs italic">{{ emailExistsError }}</p>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Логін</label>
          <input v-model="username" type="text" id="username"
            :class="{ 'border-red-500': usernameExistsError }"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
          <p v-if="usernameExistsError" class="text-red-500 text-xs italic">{{ usernameExistsError }}</p>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Пароль</label>
          <input v-model="password" type="password" id="password"
            :class="{ 'border-red-500': passwordError }"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
          <p v-if="passwordError" class="text-red-500 text-xs italic">{{ passwordError }}</p>
        </div>
        <button type="submit" :disabled="!isFormValid"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50">
          Зареєструватися
        </button>
      </form>
      <button @click="goToLogin"
        class="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Перейти до авторизації
      </button>
    </div>
  </div>
  <div v-if="showEmailExistsModal"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg scale-95 opacity-0 animate-modal">
      <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Помилка</h2>
      <p class="text-center font-bold text-gray-700 mb-6">Користувач з такою поштою вже існує</p>
      <div class="flex gap-6 justify-center">
        <button class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
          @click="closeEmailExistsModal">
          Закрити
        </button>
      </div>
    </div>
  </div>
  <div v-if="showUsernameExistsModal"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg scale-95 opacity-0 animate-modal">
      <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Помилка</h2>
      <p class="text-center font-bold text-gray-700 mb-6">Користувач з таким ім'ям вже існує</p>
      <div class="flex gap-6 justify-center">
        <button class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
          @click="closeUsernameExistsModal">
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
import { encryptData, decryptData } from "../utils/crypto";

const email = ref("");
const username = ref("");
const password = ref("");
const router = useRouter();
const emailExistsError = ref("");
const usernameExistsError = ref("");
const showEmailExistsModal = ref(false);
const showUsernameExistsModal = ref(false);

const emailError = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.value && !emailPattern.test(email.value) ? "Неправильний формат пошти" : "";
});

const passwordError = computed(() => {
  return password.value && password.value.length < 5 ? "Пароль повинен містити мінімум 5 символів" : "";
});

const isFormValid = computed(() => {
  return (
    email.value &&
    !emailError.value &&
    username.value &&
    password.value &&
    !passwordError.value
  );
});

const register = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = users.some((user) => decryptData(user.email) === email.value);
  const usernameExists = users.some(
    (user) => decryptData(user.username) === username.value && decryptData(user.email) !== email.value
  );

  if (emailExists) {
    showEmailExistsModal.value = true;
    return;
  }
  else {
    emailExistsError.value = "";
  }

  if (usernameExists) {
    showUsernameExistsModal.value = true;
    return;
  }
  else {
    usernameExistsError.value = "";
  }

  const hashedPassword = CryptoJS.SHA256(password.value).toString();
  const encryptedEmail = encryptData(email.value);
  const encryptedUsername = encryptData(username.value);
  const encryptedId = encryptData(Date.now().toString());

  const user = {
    id: encryptedId,
    email: encryptedEmail,
    username: encryptedUsername,
    password: hashedPassword,
  };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ id: encryptedId, username: encryptData(username.value) }));
  router.push("/home");
};

const closeEmailExistsModal = () => {
  showEmailExistsModal.value = false;
};

const closeUsernameExistsModal = () => {
  showUsernameExistsModal.value = false;
};

const goToLogin = () => {
  router.push("/login");
};
</script>