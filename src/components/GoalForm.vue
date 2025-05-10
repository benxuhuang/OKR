<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-xl font-semibold text-gray-800 mb-4">
      {{ isEdit ? '編輯目標' : '新增目標' }}
    </h3>
    <form @submit.prevent="handleSubmit">
      <!-- 目標標題 -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
          目標標題
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          :class="{ 'border-red-500': errors.title }"
          placeholder="請輸入目標標題"
        >
        <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
      </div>

      <!-- 頻率類型 -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          頻率類型
        </label>
        <div class="flex space-x-4">
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="formData.frequencyType"
              value="day"
              class="form-radio text-indigo-600"
            >
            <span class="ml-2">每日</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="formData.frequencyType"
              value="weekly"
              class="form-radio text-indigo-600"
            >
            <span class="ml-2">每週</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              v-model="formData.frequencyType"
              value="monthly"
              class="form-radio text-indigo-600"
            >
            <span class="ml-2">每月</span>
          </label>
        </div>
      </div>

      <!-- 執行次數 -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="timesPerPeriod">
          執行次數
        </label>
        <input
          id="timesPerPeriod"
          v-model.number="formData.timesPerPeriod"
          type="number"
          min="1"
          :max="maxTimesPerPeriod"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          :class="{ 'border-red-500': errors.timesPerPeriod }"
        >
        <p v-if="errors.timesPerPeriod" class="text-red-500 text-xs mt-1">{{ errors.timesPerPeriod }}</p>
      </div>

      <!-- 執行日期 -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          執行日期
        </label>
        <div class="grid grid-cols-7 gap-2">
          <button
            v-for="day in daysOfWeek"
            :key="day.value"
            type="button"
            class="px-2 py-1 rounded-lg text-sm"
            :class="[
              formData.daysOfWeek.includes(day.value)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="toggleDay(day.value)"
          >
            {{ day.label }}
          </button>
        </div>
      </div>

      <!-- 執行時間 -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="time">
          執行時間
        </label>
        <input
          id="time"
          v-model="formData.time"
          type="time"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        >
      </div>

      <!-- 按鈕 -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          @click="$emit('cancel')"
        >
          取消
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {{ isEdit ? '更新' : '新增' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'GoalForm',
  props: {
    goal: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        title: '',
        frequencyType: 'day',
        timesPerPeriod: 1,
        daysOfWeek: [],
        time: '09:00',
        description: '',
        completedTimes: 0,
        progress: 0
      },
      errors: {},
      daysOfWeek: [
        { label: '一', value: 'Monday' },
        { label: '二', value: 'Tuesday' },
        { label: '三', value: 'Wednesday' },
        { label: '四', value: 'Thursday' },
        { label: '五', value: 'Friday' },
        { label: '六', value: 'Saturday' },
        { label: '日', value: 'Sunday' }
      ]
    }
  },
  computed: {
    maxTimesPerPeriod() {
      switch (this.formData.frequencyType) {
        case 'day':
          return 1
        case 'weekly':
          return 7
        case 'monthly':
          return 31
        default:
          return 1
      }
    }
  },
  watch: {
    goal: {
      immediate: true,
      handler(newGoal) {
        if (newGoal && Object.keys(newGoal).length > 0) {
          this.formData = { ...newGoal }
        }
      }
    }
  },
  methods: {
    toggleDay(day) {
      const index = this.formData.daysOfWeek.indexOf(day)
      if (index === -1) {
        this.formData.daysOfWeek.push(day)
      } else {
        this.formData.daysOfWeek.splice(index, 1)
      }
    },
    validate() {
      this.errors = {};
      
      // 驗證標題
      if (!this.formData.title?.trim()) {
        this.errors.title = '請輸入目標標題';
        return false;
      }
      
      // 驗證執行次數
      const timesPerPeriod = parseInt(this.formData.timesPerPeriod);
      if (!timesPerPeriod || timesPerPeriod < 1) {
        this.errors.timesPerPeriod = '請輸入有效的執行次數';
        return false;
      }
      
      if (timesPerPeriod > this.maxTimesPerPeriod) {
        this.errors.timesPerPeriod = `執行次數不能超過 ${this.maxTimesPerPeriod} 次`;
        return false;
      }
      
      // 驗證執行日期
      if (this.formData.frequencyType === 'weekly' && (!Array.isArray(this.formData.daysOfWeek) || this.formData.daysOfWeek.length === 0)) {
        this.errors.daysOfWeek = '請選擇至少一個執行日期';
        return false;
      }
      
      // 驗證時間格式
      if (this.formData.time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this.formData.time)) {
        this.errors.time = '請輸入有效的時間格式 (HH:MM)';
        return false;
      }
      
      return Object.keys(this.errors).length === 0;
    },
    handleSubmit() {
      if (this.validate()) {
        this.$emit('submit', {
          ...this.formData,
          completedTimes: this.formData.completedTimes || 0,
          progress: this.formData.progress || 0,
          description: this.formData.description || ''
        })
      }
    }
  }
}
</script> 