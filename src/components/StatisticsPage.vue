<template>
  <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-4xl font-bold text-gray-900 text-center mb-8 tracking-wide">Статистика</h1>
    <div id="chart-container" class="mt-20 mb-10" style="width: 100%; height: 400px;"></div>
    <div class="mt-6">
      <label for="date-picker" class="block text-sm font-medium text-gray-700">Виберіть дату:</label>
      <input type="date" id="date-picker" v-model="selectedDate" @change="updateHistory" :max="currentDate" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>
    <div class="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Історія за {{ formatDate(selectedDate) }}</h2>
      <ul class="space-y-4">
        <li v-for="task in filteredTasks" :key="task.id" class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-lg">{{ task.name }}</span>
            <span class="font-semibold text-lg">Загальний час: {{ formatTime(calculateElapsedTimeForDate(task.intervals, selectedDate)) }}</span>
          </div>
          <ul class="mt-2 space-y-2">
            <li v-for="interval in task.intervals" :key="interval.startAt" class="text-sm text-gray-600 font-bold flex justify-between">
              <span>Тривалість: {{ formatTime(moment(interval.endAt).diff(moment(interval.startAt), "seconds")) }}</span>
              <span>({{ moment(interval.startAt).format("HH:mm") }} - {{ moment(interval.endAt).format("HH:mm") }})</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <button
      class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 font-semibold"
      @click="goBack">
      Назад
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import Highcharts from "highcharts";
import { useRouter } from "vue-router";
import moment from "moment";

const tasks = ref(JSON.parse(localStorage.getItem("tasks")) || []);
const selectedDate = ref(moment().format("YYYY-MM-DD"));
const currentDate = ref(moment().format("YYYY-MM-DD"));
const router = useRouter();
let interval = null;

const filterIntervalsForDate = (intervals, date) => {
  const selectedDateStart = moment(date).startOf("day");
  const selectedDateEnd = moment(date).endOf("day");

  return intervals
    .filter(({ startAt, endAt }) => {
      const start = moment(startAt);
      const end = endAt ? moment(endAt) : moment();
      if (start.isAfter(end)) {
        console.warn(`Start time ${startAt} is after end time ${endAt}`);
        return false;
      }
      return start.isBefore(selectedDateEnd) && end.isAfter(selectedDateStart);
    })
    .map(({ startAt, endAt }) => {
      const adjustedStart = moment(startAt).isBefore(selectedDateStart) ? selectedDateStart : moment(startAt);
      const adjustedEnd = endAt ? moment(endAt).isAfter(selectedDateEnd) ? selectedDateEnd : moment(endAt) : moment();
      return { startAt: adjustedStart, endAt: adjustedEnd };
    });
};

const calculateElapsedTimeForDate = (intervals, date) => {
  let totalSeconds = 0;
  const selectedDateStart = moment(date).startOf('day');
  const selectedDateEnd = moment(date).endOf('day');

  intervals.forEach(({ startAt, endAt }) => {
    const start = moment(startAt);
    const end = endAt ? moment(endAt) : moment(); 

    if (start.isAfter(end)) {
      console.warn(`Start time ${startAt} is after end time ${endAt}`);
      return;
    }

    if (start.isBefore(selectedDateEnd) && end.isAfter(selectedDateStart)) {
      const adjustedStart = start.isBefore(selectedDateStart) ? selectedDateStart : start;
      const adjustedEnd = end.isAfter(selectedDateEnd) ? selectedDateEnd : end;
      totalSeconds += adjustedEnd.diff(adjustedStart, 'seconds');
    }
  });

  return totalSeconds;
};

const filteredTasks = computed(() => {
  return tasks.value
    .map((task) => {
      const intervals = filterIntervalsForDate(task.intervals, selectedDate.value);
      return intervals.length > 0 ? { ...task, intervals } : null;
    })
    .filter((task) => task !== null);
});

const formatTime = (seconds) => {
  const duration = moment.duration(seconds, 'seconds');
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const secs = duration.seconds();
  return `${days > 0 ? days + ' дн ' : ''}${hours} год ${minutes} хв ${secs} сек`;
};

const formatDate = (date) => {
  return moment(date).format("DD.MM.YYYY");
};

const renderChart = () => {
  const chartData = tasks.value.map((task) => ({
    name: task.name,
    y: task.intervals.reduce((sum, { startAt, endAt }) => {
      const start = moment(startAt);
      const end = endAt ? moment(endAt) : moment();
      return sum + end.diff(start, "seconds");
    }, 0),
  }));

  Highcharts.chart("chart-container", {
    chart: {
      type: "pie",
    },
    title: {
      text: "Розподілення часу по задачам",
    },
    series: [
      {
        name: "Час",
        colorByPoint: true,
        data: chartData.length ? chartData : [{ name: "Немає даних", y: 0 }],
      },
    ],
  });
};

const goBack = () => {
  router.push({ name: "Home" });
};

const updateHistory = () => {
  const newTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (JSON.stringify(newTasks) !== JSON.stringify(tasks.value)) {
    tasks.value = newTasks;
  }
};

watch(selectedDate, updateHistory);

onMounted(() => {
  renderChart();
  updateHistory();

  window.addEventListener("storage", () => {
    renderChart();
    updateHistory();
  });

  interval = setInterval(() => {
    const hasActiveTasks = tasks.value.some((task) =>
      task.intervals.some((interval) => !interval.endAt)
    );
    if (hasActiveTasks) {
      renderChart();
      updateHistory();
    }
  }, 30000);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', renderChart);
  clearInterval(interval);
});
</script>