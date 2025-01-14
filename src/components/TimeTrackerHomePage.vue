<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-4xl font-bold text-gray-900 text-center mb-8 tracking-wide">Персональний трекер часу</h1>

    <div class="overflow-hidden rounded-lg border border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <table class="min-w-full divide-y divide-gray-200 bg-white">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Задача</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Час</th>
            <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Дії</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(task, index) in tasks" :key="task.id">
            <td class="px-6 py-4 text-sm font-semibold text-gray-800">
              <span class="cursor-pointer hover:text-teal-600 hover:underline" @click="editTask(task.id)">{{ task.name }}</span>
            </td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ formatTime(calculateElapsedTime(task.intervals)) }}</td>
            <td class="px-6 py-4 text-right flex items-center justify-end space-x-4">
              <button class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 disabled:opacity-50"
                @click="continueTask(index)" :disabled="activeTaskIndex === index">
                Продовжити
              </button>
              <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" @click="deleteTask(index)">
                Видалити
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold"
      @click="showModal = true">
      Почати нову задачу
    </button>

    <button class="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold"
      @click="showNewTaskWithTimeModal = true">
      Створити задачу із записом часу
    </button>

    <button class="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold"
      @click="showAddTimeModal = true">
      Додати запис часу
    </button>

    <button class="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold"
      @click="goToStatistics">
      Переглянути статистику
    </button>

    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Нова задача</h2>
        <input v-model="newTaskName" type="text" placeholder="Назва задачі"
          class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium" />
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold"
            @click="startNewTask">
            Почати
          </button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
            @click="closeModal">
            Закрити
          </button>
        </div>
      </div>
    </div>

    <div v-if="editModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Редагувати задачу</h2>
        <input v-model="taskToEdit.name" type="text" placeholder="Назва задачі"
          class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium" />
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold"
            @click="saveEditedTask">
            Зберегти
          </button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
            @click="closeEditModal">
            Закрити
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Підтвердження видалення</h2>
        <p class="text-gray-700 mb-6 text-center">Ви впевнені, що хочете видалити цю задачу?</p>
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold"
            @click="confirmDeleteTask">
            Видалити
          </button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
            @click="closeDeleteModal">
            Скасувати
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddTimeModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Додати запис часу</h2>
        <label for="task-select" class="block text-sm font-medium text-gray-700">Виберіть задачу:</label>
        <select id="task-select" v-model="selectedTaskId" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.name }}</option>
        </select>
        <label for="start-time" class="block text-sm font-medium text-gray-700 mt-4">Час початку:</label>
        <input type="datetime-local" id="start-time" v-model="startTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <label for="end-time" class="block text-sm font-medium text-gray-700 mt-4">Час закінчення:</label>
        <input type="datetime-local" id="end-time" v-model="endTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <p v-if="isInvalidTime" class="text-red-600 text-sm mt-2">Час початку не може бути пізніше часу закінчення</p>
        <div class="flex gap-6 justify-between mt-6">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold"
            @click="addTimeEntry" :disabled="isInvalidTime">
            Додати
          </button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
            @click="closeAddTimeModal">
            Закрити
          </button>
        </div>
      </div>
    </div>

    <div v-if="showNewTaskWithTimeModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Нова задача з записом часу</h2>
        <input v-model="newTaskName" type="text" placeholder="Назва задачі"
          class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium" />
        <label for="start-time-new" class="block text-sm font-medium text-gray-700 mt-4">Час початку:</label>
        <input type="datetime-local" id="start-time-new" v-model="startTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <label for="end-time-new" class="block text-sm font-medium text-gray-700 mt-4">Час закінчення:</label>
        <input type="datetime-local" id="end-time-new" v-model="endTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <p v-if="isInvalidTime" class="text-red-600 text-sm mt-2">Час початку не може бути пізніше часу закінчення</p>
        <div class="flex gap-6 justify-between mt-6">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold"
            @click="addNewTaskWithTime" :disabled="isInvalidTime">
            Додати
          </button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
            @click="closeNewTaskWithTimeModal">
            Закрити
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDuplicateTaskModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Помилка</h2>
        <p class="text-center font-bold text-gray-700 mb-6">Задача з такою назвою вже існує</p>
        <div class="flex gap-6 justify-center">
          <button class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold"
            @click="closeDuplicateTaskModal">
            Закрити
          </button>
        </div>
      </div>
    </div>

    <div v-if="activeTaskIndex !== null" class="mt-6 p-4 bg-yellow-100 rounded-lg shadow-xl">
      <h2 class="text-lg font-semibold text-yellow-800">Активна задача: {{ tasks[activeTaskIndex].name }}</h2>
      <p class="text-yellow-700">Час: <span class="font-semibold">{{ formatTime(timer) }}</span></p>
      <button class="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold"
        @click="finishTask">
        Завершити роботу
      </button>
    </div>
  </div>
</template>

<style>
body {
  background-color: #f3f4f6;
  font-family: "Inter", sans-serif;
}

@keyframes modal {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-modal {
  animation: modal 0.3s ease-out forwards;
}

.fixed {
  z-index: 10;
}
</style>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import moment from "moment";
import { useRouter } from "vue-router";

const tasks = ref(JSON.parse(localStorage.getItem("tasks")) || []);
const newTaskName = ref("");
const taskToEdit = ref({});
const activeTaskIndex = ref(null);
const timer = ref(0);
const showModal = ref(false);
const editModal = ref(false);
const showDeleteModal = ref(false);
const showAddTimeModal = ref(false);
const showNewTaskWithTimeModal = ref(false);
const showDuplicateTaskModal = ref(false);
const selectedTaskId = ref(null);
const startTime = ref("");
const endTime = ref("");
const taskIndexToDelete = ref(null);
const currentDateTime = ref(moment().format("YYYY-MM-DDTHH:mm"));
let interval = null;
const router = useRouter();

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const calculateElapsedTime = (intervals) => {
  let totalSeconds = 0;
  intervals.forEach(({ startAt, endAt }) => {
    const start = moment(startAt);
    const end = endAt ? moment(endAt) : moment();
    totalSeconds += end.diff(start, "seconds");
  });
  return totalSeconds;
};

const formatTime = (seconds) => {
  const duration = moment.duration(seconds, 'seconds');
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();
  return `${days > 0 ? days + ' дн ' : ''}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const startTimer = () => {
  stopTimer();
  interval = setInterval(() => {
    if (activeTaskIndex.value !== null) {
      const activeTask = tasks.value[activeTaskIndex.value];
      activeTask.intervals[activeTask.intervals.length - 1].endAt = moment().toISOString();
      timer.value = calculateElapsedTime(activeTask.intervals);
      saveTasks();
    }
  }, 1000);
};

const stopTimer = () => {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
};

const saveTimerState = () => {
  localStorage.setItem('activeTaskIndex', JSON.stringify(activeTaskIndex.value));
};

const loadTimerState = () => {
  const savedIndex = JSON.parse(localStorage.getItem('activeTaskIndex'));
  if (savedIndex !== null) {
    activeTaskIndex.value = savedIndex;
    const activeTask = tasks.value[activeTaskIndex.value];
    timer.value = calculateElapsedTime(activeTask.intervals);
    activeTask.intervals[activeTask.intervals.length - 1].endAt = moment().toISOString();
    timer.value = calculateElapsedTime(activeTask.intervals);
    startTimer();
  }
};

const startNewTask = () => {
  if (tasks.value.some(task => task.name === newTaskName.value)) {
    showDuplicateTaskModal.value = true;
    return;
  }
  const newTask = { id: Date.now(), name: newTaskName.value, intervals: [{ startAt: moment().toISOString(), endAt: null }] };
  tasks.value.push(newTask);
  activeTaskIndex.value = tasks.value.length - 1;
  timer.value = 0;
  newTaskName.value = "";
  showModal.value = false;
  saveTasks();
  startTimer();
};

const addNewTaskWithTime = () => {
  if (tasks.value.some(task => task.name === newTaskName.value)) {
    showDuplicateTaskModal.value = true;
    return;
  }
  const newTask = { id: Date.now(), name: newTaskName.value, intervals: [{ startAt: moment(startTime.value).toISOString(), endAt: moment(endTime.value).toISOString() }] };
  tasks.value.push(newTask);
  newTaskName.value = "";
  startTime.value = "";
  endTime.value = "";
  showNewTaskWithTimeModal.value = false;
  saveTasks();
};

const continueTask = (index) => {
  const task = tasks.value[index];
  task.intervals.push({ startAt: moment().toISOString(), endAt: null });
  activeTaskIndex.value = index;
  timer.value = calculateElapsedTime(task.intervals);
  startTimer();
};

const finishTask = () => {
  if (activeTaskIndex.value !== null) {
    const activeTask = tasks.value[activeTaskIndex.value];
    activeTask.intervals[activeTask.intervals.length - 1].endAt = moment().toISOString();
    saveTasks();
  }
  activeTaskIndex.value = null;
  timer.value = 0;
  stopTimer();
};

const deleteTask = (index) => {
  taskIndexToDelete.value = index;
  showDeleteModal.value = true;
};

const confirmDeleteTask = () => {
  if (taskIndexToDelete.value !== null) {
    if (activeTaskIndex.value === taskIndexToDelete.value) {
      stopTimer();
      activeTaskIndex.value = null;
      timer.value = 0;
    }
    tasks.value.splice(taskIndexToDelete.value, 1);
    saveTasks();
    taskIndexToDelete.value = null;
    showDeleteModal.value = false;
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  taskIndexToDelete.value = null;
};

const closeModal = () => {
  showModal.value = false;
};

const editTask = (id) => {
  const task = tasks.value.find(task => task.id === id);
  if (task) {
    taskToEdit.value = { ...task };
    editModal.value = true;
  }
};

const closeEditModal = () => {
  editModal.value = false;
};

const saveEditedTask = () => {
  const taskIndex = tasks.value.findIndex(task => task.id === taskToEdit.value.id);
  if (taskIndex !== -1) {
    tasks.value[taskIndex].name = taskToEdit.value.name;
    saveTasks();
  }
  closeEditModal();
};

const goToStatistics = () => {
  router.push({ name: "Statistics" });
};

const isInvalidTime = computed(() => {
  return startTime.value && endTime.value && moment(startTime.value).isAfter(moment(endTime.value));
});

const addTimeEntry = () => {
  if (isInvalidTime.value) {
    return;
  }
  const task = tasks.value.find(task => task.id === selectedTaskId.value);
  if (task) {
    task.intervals.push({ startAt: moment(startTime.value).toISOString(), endAt: moment(endTime.value).toISOString() });
    saveTasks();
    closeAddTimeModal();
  }
};

const closeAddTimeModal = () => {
  showAddTimeModal.value = false;
  selectedTaskId.value = null;
  startTime.value = "";
  endTime.value = "";
};

const closeNewTaskWithTimeModal = () => {
  showNewTaskWithTimeModal.value = false;
  newTaskName.value = "";
  startTime.value = "";
  endTime.value = "";
};

const closeDuplicateTaskModal = () => {
  showDuplicateTaskModal.value = false;
};

watch(activeTaskIndex, (newIndex) => {
  if (newIndex !== null) {
    startTimer();
  }
  else {
    stopTimer();
  }
  saveTimerState();
});

onBeforeUnmount(() => {
  stopTimer();
  saveTimerState();
});

onMounted(() => {
  loadTimerState();
  if (activeTaskIndex.value !== null) {
    const activeTask = tasks.value[activeTaskIndex.value];
    timer.value = calculateElapsedTime(activeTask.intervals);
    activeTask.intervals[activeTask.intervals.length - 1].endAt = moment().toISOString();
    timer.value = calculateElapsedTime(activeTask.intervals);
    startTimer();
  }
});
</script>