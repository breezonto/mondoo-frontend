<template>
    <div class="search-box">
    <input
        v-model="rSearchKeyword"
        type="text"
        placeholder="Search..."
        class="search-input"
        @keyup.enter="onSearch"
    />
    <button class="search-btn" @click="onSearch">Search</button>

    </div>
</template>


<script setup lang='ts'>

import { ref } from 'vue';

const rSearchKeyword = ref('');


const onSearch = async () => {};

</script>


<style scoped>
.search-section {
  margin-bottom: 12px;
  flex-shrink: 0;
}
.search-box {
  display: flex;
  gap: 8px;
  align-items: center;
}
.search-input {
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #1890ff;
}
.search-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.search-btn:hover {
  background: #40a9ff;
}
.clear-btn {
  padding: 8px 16px;
  background: #f5f7fa;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.clear-btn:hover {
  background: #e8e8e8;
}

.date-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.date-input {
  max-width: 160px !important;
}

.date-separator {
  color: #999;
  margin: 0 4px;
}
</style>
