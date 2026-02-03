<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Box from './components/Box.vue';
import dayjs from 'dayjs';
import { monthsFromDateToToday, weeksFromDateToToday, yearsMonthsDaysFromDate } from "./utils/date.js";

const state = reactive({
  mode: 'year',
  months: [],
  today: dayjs().utc().local().format('ddd, MMM D, YYYY hh:mm:ss A')
  // today: dayjs().utc().local().format('lll')
});
const weekInYear = 52;
const lifeYear = 90;
const dob = dayjs.utc('1994-04-17').format();
const totalDaysInYear = dayjs().isLeapYear() ? 366 : 365;
const currentYear = new Date().getFullYear();
const test = yearsMonthsDaysFromDate("1994-04-17");

const weeksFromToday = computed(() => parseInt());
function yearCount() {
  return weeksFromDateToToday(dob) / weekInYear;
}
function yearRemainingCount() {
  return parseInt(test.months * 4.35);
}

function getMonthList(format = "MMMM") {
  let sum = 0;
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const days = dayjs().year(currentYear).month(monthIndex).daysInMonth();
    sum = days + sum;
    return {
      index: monthIndex, // 0 = January
      label: dayjs().month(monthIndex).format(format),
      shortName: dayjs().month(monthIndex).format('MMM'),
      longName: dayjs().month(monthIndex).format('MMMM'),
      days,
      monthStartDayCount: sum
    }
  })
}

onMounted(() => {
  state.months = getMonthList();
  // currentYear

})

let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    state.today = dayjs().utc().local().format('ddd, MMM D, YYYY hh:mm:ss A');
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div class="md:flex gap-3 mb-4 justify-between">
        <div class="flex gap-3">
          <div @click="state.mode = 'life'" class="cursor-pointer">Life Calendar</div>
          <div @click="state.mode = 'year'" class="cursor-pointer">Year Calendar</div>
        </div>
        <div class="flex gap-3">
          <div>{{ (dayjs().dayOfYear() / totalDaysInYear * 100).toFixed(2) }}%</div>
          <div>{{ state.today }}</div>
        </div>
      </div>
      <div>
        <div v-if="state.mode === 'life'" class="grid gap-2">
          <div v-for="year in lifeYear" :key="year" class="flex items-end gap-1">
            <div class="w-6 text-xs text-gray-400">{{ year - 1 }}</div>
            <div class="flex gap-1 justify-between flex-1">
              <div v-for="week in weekInYear" :key="week">
                <div v-if="year == 1" class="text-xs text-gray-400 mb-2">{{ week }}</div>
                <Box
                  :classes="year <= yearCount() || ((parseInt(yearCount() + 1) === year) && (week <= yearRemainingCount())) ? 'bg-red-100 border-red-300' : 'bg-blue-100 border-blue-300'" />
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="state.mode === 'year'">
          <div>
            <div class="flex gap-2">
              <div v-for="item in 32" :key="item">
                <div v-if="item === 1" class="w-20">
                </div>
                <div v-else class="size-4 flex justify-center text-xs">
                  {{ item - 1 }}
                </div>
              </div>
            </div>
            <div v-for="month in state.months" :key="month.index" class="flex items-center gap-2">
              <div class="w-20">{{ month.label }}</div>
              <div class="flex gap-2">
                <div v-for="(day, index) in month.days" :key="index">
                  <Box
                    :classes="(state.months[month.index - 1]?.monthStartDayCount ? state.months[month.index -
                      1]?.monthStartDayCount + day : day) <= dayjs().dayOfYear() ? 'bg-red-100 border-red-300 dark:bg-red-300 dark:border-red-500' : 'bg-blue-100 border-blue-300'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
