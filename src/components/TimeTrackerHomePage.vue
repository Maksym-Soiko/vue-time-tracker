<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-4xl font-bold text-gray-900 text-center mb-8 tracking-wide">Персональний трекер часу</h1>

    <div class="mb-6">
      <ul class="flex border-b">
        <li class="-mb-px mr-1">
          <a :class="{'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold' :activeTab === 'tasks',}" @click="activeTab = 'tasks'" class="bg-gray-200 inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer">Задачі</a>
        </li>
        <li class="mr-1">
          <a :class="{'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold' :activeTab === 'projects',}" @click="activeTab = 'projects'" class="bg-gray-200 inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold cursor-pointer">Проєкти</a>
        </li>
      </ul>
    </div>

    <TaskList v-if="activeTab === 'tasks'" :tasks="tasks" :activeTaskIndex="activeTaskIndex" :getProjectName="getProjectName" :formatTime="formatTime" :calculateElapsedTime="calculateElapsedTime" @editTask="editTask" @continueTask="continueTask" @deleteTask="deleteTask" />

    <ProjectList v-if="activeTab === 'projects'" :projects="projects" @editProject="editProject" @confirmDeleteProject="confirmDeleteProject" />

    <button v-if="activeTab === 'tasks'" class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold" @click="showModal = true">Почати нову задачу</button>

    <button v-if="activeTab === 'tasks'" class="mt-6 w-full px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold" @click="showNewTaskWithTimeModal = true">Створити задачу із записом часу</button>

    <button v-if="activeTab === 'tasks'" class="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold" @click="showAddTimeModal = true">Додати запис часу</button>

    <button v-if="activeTab === 'tasks'" class="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold" @click="goToStatistics">Переглянути статистику</button>

    <button v-if="activeTab === 'projects'" class="mt-6 w-full px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold" @click="showProjectModal = true">Створити новий проєкт</button>

    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Нова задача</h2>
        <input v-model="newTaskName" type="text" placeholder="Назва задачі" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium"/>
        <label for="project-select" class="block text-sm font-medium text-gray-700">Виберіть проєкт:</label>
        <select id="project-select" v-model="selectedProjectId" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
        <div class="flex gap-6 justify-between mt-6">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold" @click="startNewTask" :disabled="!newTaskName">Почати</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="editModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Редагувати задачу</h2>
        <input v-model="taskToEdit.name" type="text" placeholder="Назва задачі" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium"/>
        <label for="project-select-edit" class="block text-sm font-medium text-gray-700">Виберіть проєкт:</label>
        <select id="project-select-edit" v-model="taskToEdit.projectId" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
        <div class="flex gap-6 justify-between mt-6">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold" @click="saveEditedTask" :disabled="!taskToEdit.name">Зберегти</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeEditModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Підтвердження видалення</h2>
        <p class="text-gray-700 mb-6 text-center">Ви впевнені, що хочете видалити цю задачу?</p>
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold" @click="confirmDeleteTask">Видалити</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeDeleteModal">Скасувати</button>
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
        <input type="datetime-local" id="start-time" v-model="startTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        <label for="end-time" class="block text-sm font-medium text-gray-700 mt-4">Час закінчення:</label>
        <input type="datetime-local" id="end-time" v-model="endTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        <p v-if="isInvalidTime" class="text-red-600 text-sm mt-2">Час початку не може бути пізніше часу закінчення</p>
        <div class="flex gap-6 justify-between mt-6">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold" @click="addTimeEntry" :disabled="isInvalidTime">Додати</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeAddTimeModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="showNewTaskWithTimeModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Нова задача з записом часу</h2>
        <input v-model="newTaskName" type="text" placeholder="Назва задачі" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium"/>
        <label for="project-select" class="block text-sm font-medium text-gray-700">Виберіть проєкт:</label>
        <select id="project-select" v-model="selectedProjectId" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
        <label for="start-time-new" class="block text-sm font-medium text-gray-700 mt-4">Час початку:</label>
        <input type="datetime-local" id="start-time-new" v-model="startTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        <label for="end-time-new" class="block text-sm font-medium text-gray-700 mt-4">Час закінчення:</label>
        <input type="datetime-local" id="end-time-new" v-model="endTime" :max="currentDateTime" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        <p v-if="isInvalidTime" class="text-red-600 text-sm mt-2">Час початку не може бути пізніше часу закінчення</p>
        <div class="flex gap-6 justify-between mt-6">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold" @click="addNewTaskWithTime" :disabled="isInvalidTime || !newTaskName">Додати</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeNewTaskWithTimeModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="showDuplicateTaskModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Помилка</h2>
        <p class="text-center font-bold text-gray-700 mb-6">Задача з такою назвою вже існує</p>
        <div class="flex gap-6 justify-center">
          <button class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeDuplicateTaskModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="showProjectModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Новий проєкт</h2>
        <input v-model="newProjectName" type="text" placeholder="Назва проєкту" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium"/>
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold" @click="createProject" :disabled="!newProjectName">Створити</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeProjectModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="editProjectModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Редагувати проєкт</h2>
        <input v-model="projectToEdit.name" type="text" placeholder="Назва проєкту" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-900 font-medium"/>
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 font-semibold" @click="saveEditedProject" :disabled="!projectToEdit.name">Зберегти</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeEditProjectModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteProjectModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Підтвердження видалення</h2>
        <p class="text-gray-700 mb-6 text-center">Ви впевнені, що хочете видалити цей проєкт?</p>
        <div class="flex gap-6 justify-between">
          <button class="w-1/2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold" @click="deleteProject(projectIdToDelete)">Видалити</button>
          <button class="w-1/2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeDeleteProjectModal">Скасувати</button>
        </div>
      </div>
    </div>

    <div v-if="showDuplicateProjectModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
      <div class="bg-white p-8 rounded-lg shadow-xl w-1/3 scale-95 opacity-0 animate-modal">
        <h2 class="text-2xl font-bold text-red-600 mb-6 text-center">Помилка</h2>
        <p class="text-center font-bold text-gray-700 mb-6">Проєкт з такою назвою вже існує</p>
        <div class="flex gap-6 justify-center">
          <button class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-semibold" @click="closeDuplicateProjectModal">Закрити</button>
        </div>
      </div>
    </div>

    <div v-if="activeTaskIndex !== null" class="mt-6 p-4 bg-yellow-100 rounded-lg shadow-xl">
      <h2 class="text-lg font-semibold text-yellow-800">Активна задача: {{ tasks[activeTaskIndex].name }}</h2>
      <p class="text-yellow-700">Час: <span class="font-semibold">{{ formatTime(timer) }}</span></p>
      <button class="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold" @click="finishTask">Завершити роботу</button>
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
import TaskList from "./TaskList.vue";
import ProjectList from "./ProjectList.vue";

const tasks = ref(JSON.parse(localStorage.getItem("tasks")) || []);
const projects = ref(JSON.parse(localStorage.getItem("projects")) || []);
const newTaskName = ref("");
const newProjectName = ref("");
const taskToEdit = ref({});
const projectToEdit = ref({});
const activeTaskIndex = ref(null);
const timer = ref(0);
const showModal = ref(false);
const editModal = ref(false);
const showDeleteModal = ref(false);
const showAddTimeModal = ref(false);
const showNewTaskWithTimeModal = ref(false);
const showDuplicateTaskModal = ref(false);
const showProjectModal = ref(false);
const editProjectModal = ref(false);
const showDeleteProjectModal = ref(false);
const selectedTaskId = ref(null);
const selectedProjectId = ref(null);
const startTime = ref("");
const endTime = ref("");
const taskIndexToDelete = ref(null);
const projectIdToDelete = ref(null);
const currentDateTime = ref(moment().format("YYYY-MM-DDTHH:mm"));
const showDuplicateProjectModal = ref(false);
let interval = null;
const router = useRouter();
const activeTab = ref("tasks");

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const saveProjects = () => {
  localStorage.setItem("projects", JSON.stringify(projects.value));
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
  const duration = moment.duration(seconds, "seconds");
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();
  return `${days > 0 ? days + " дн " : ""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
  localStorage.setItem("activeTaskIndex", JSON.stringify(activeTaskIndex.value));
};

const loadTimerState = () => {
  const savedIndex = JSON.parse(localStorage.getItem("activeTaskIndex"));
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
  if (tasks.value.some((task) => task.name === newTaskName.value && task.projectId === selectedProjectId.value)) {
    showDuplicateTaskModal.value = true;
    return;
  }
  const newTask = {
    id: Date.now(),
    name: newTaskName.value,
    projectId: selectedProjectId.value,
    intervals: [{ startAt: moment().toISOString(), endAt: null }],
  };
  tasks.value.push(newTask);
  activeTaskIndex.value = tasks.value.length - 1;
  timer.value = 0;
  newTaskName.value = "";
  selectedProjectId.value = null;
  showModal.value = false;
  saveTasks();
  startTimer();
};

const addNewTaskWithTime = () => {
  if (tasks.value.some((task) => task.name === newTaskName.value && task.projectId === selectedProjectId.value)) {
    showDuplicateTaskModal.value = true;
    return;
  }
  const newTask = {
    id: Date.now(),
    name: newTaskName.value,
    projectId: selectedProjectId.value,
    intervals: [
      {
        startAt: moment(startTime.value).toISOString(),
        endAt: moment(endTime.value).toISOString(),
      },
    ],
  };
  tasks.value.push(newTask);
  newTaskName.value = "";
  selectedProjectId.value = null;
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
  const task = tasks.value.find((task) => task.id === id);
  if (task) {
    taskToEdit.value = { ...task };
    editModal.value = true;
  }
};

const closeEditModal = () => {
  editModal.value = false;
};

const saveEditedTask = () => {
  if (tasks.value.some((task) => task.name === taskToEdit.value.name && task.projectId === taskToEdit.value.projectId && task.id !== taskToEdit.value.id)) {
    showDuplicateTaskModal.value = true;
    return;
  }
  const taskIndex = tasks.value.findIndex((task) => task.id === taskToEdit.value.id);
  if (taskIndex !== -1) {
    tasks.value[taskIndex].name = taskToEdit.value.name;
    tasks.value[taskIndex].projectId = taskToEdit.value.projectId;
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
  const task = tasks.value.find((task) => task.id === selectedTaskId.value);
  if (task) {
    task.intervals.push({
      startAt: moment(startTime.value).toISOString(),
      endAt: moment(endTime.value).toISOString(),
    });
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
  selectedProjectId.value = null;
  startTime.value = "";
  endTime.value = "";
};

const closeDuplicateTaskModal = () => {
  showDuplicateTaskModal.value = false;
};

const createProject = () => {
  if (projects.value.some((project) => project.name === newProjectName.value)) {
    showDuplicateProjectModal.value = true;
    return;
  }
  const newProject = { id: Date.now(), name: newProjectName.value };
  projects.value.push(newProject);
  newProjectName.value = "";
  showProjectModal.value = false;
  saveProjects();
};

const closeDuplicateProjectModal = () => {
  showDuplicateProjectModal.value = false;
};

const editProject = (id) => {
  const project = projects.value.find((project) => project.id === id);
  if (project) {
    projectToEdit.value = { ...project };
    editProjectModal.value = true;
  }
};

const saveEditedProject = () => {
  if (projects.value.some((project) => project.name === projectToEdit.value.name && project.id !== projectToEdit.value.id)) {
    showDuplicateProjectModal.value = true;
    return;
  }
  const projectIndex = projects.value.findIndex((project) => project.id === projectToEdit.value.id);
  if (projectIndex !== -1) {
    projects.value[projectIndex].name = projectToEdit.value.name;
    saveProjects();
  }
  closeEditProjectModal();
};

const deleteProject = (projectId) => {
  projects.value = projects.value.filter((project) => project.id !== projectId);
  tasks.value.forEach((task) => {
    if (task.projectId === projectId) {
      task.projectId = null;
    }
  });
  saveProjects();
  saveTasks();
  closeDeleteProjectModal();
};

const confirmDeleteProject = (projectId) => {
  projectIdToDelete.value = projectId;
  showDeleteProjectModal.value = true;
};

const closeProjectModal = () => {
  showProjectModal.value = false;
};

const closeEditProjectModal = () => {
  editProjectModal.value = false;
};

const closeDeleteProjectModal = () => {
  showDeleteProjectModal.value = false;
};

const getProjectName = (projectId) => {
  const project = projects.value.find(project => project.id === projectId);
  return project ? project.name : 'Без проєкту';
};

watch(activeTaskIndex, (newIndex) => {
  if (newIndex !== null) {
    startTimer();
  } else {
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