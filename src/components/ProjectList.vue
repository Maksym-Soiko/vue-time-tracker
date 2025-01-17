<template>
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Проєкти</h2>
    <ul class="space-y-4">
      <li v-for="project in filteredProjects" :key="project.id"
        class="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <span class="cursor-pointer hover:text-teal-600 hover:underline font-semibold text-lg"
          @click="editProject(project.id)">{{ project.name }}</span>
        <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 font-semibold"
          @click="confirmDeleteProject(project.id)">
          Видалити
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  projects: Array,
});

const emit = defineEmits(["editProject", "confirmDeleteProject"]);

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const filteredProjects = computed(() => {
  return props.projects.filter(
    (project) => project.userId === currentUser.username
  );
});

const editProject = (id) => {
  emit("editProject", id);
};

const confirmDeleteProject = (id) => {
  emit("confirmDeleteProject", id);
};
</script>