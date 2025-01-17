<template>
  <div class="overflow-hidden rounded-lg border border-gray-300 shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <table class="min-w-full divide-y divide-gray-200 bg-white">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Задача</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Проєкт</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Час</th>
          <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Дії</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(task, index) in filteredTasks" :key="task.id">
          <td class="px-6 py-4 text-sm font-semibold text-gray-800">
            <span class="cursor-pointer hover:text-teal-600 hover:underline" @click="editTask(task.id)">{{ task.name }}</span>
          </td>
          <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ getProjectName(task.projectId) }}</td>
          <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ formatTime(calculateElapsedTime(task.intervals)) }}</td>
          <td class="px-6 py-4 text-right flex items-center justify-end space-x-4">
            <button class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 disabled:opacity-50" @click="continueTask(index)" :disabled="activeTaskIndex === index">Продовжити</button>
            <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" @click="deleteTask(index)">Видалити</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  tasks: Array,
  activeTaskIndex: Number,
  getProjectName: Function,
  formatTime: Function,
  calculateElapsedTime: Function,
});

const emit = defineEmits(['editTask', 'continueTask', 'deleteTask']);

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

const filteredTasks = computed(() => {
  return props.tasks.filter(task => task.userId === currentUser.username);
});

const editTask = (id) => {
  emit('editTask', id);
};

const continueTask = (index) => {
  emit('continueTask', index);
};

const deleteTask = (index) => {
  emit('deleteTask', index);
};
</script>