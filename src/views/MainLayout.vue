<template>
  <div class="app-container">
    <!-- Sidebar -->
    <Sidebar 
      :isOpen="rIsSidebarOpen" 
      @close="onCloseSidebar"
    />
    
    <!-- Main Area -->
    <main class="content">
      <!-- Topbar -->
      <div class="top-bar">
        <button class="hamburger-btn" @click="onToggleSidebar">☰</button>
        <div class="title-area">
          <h1 class="main-title">{{ currentTitle }}</h1>
          <span class="version-text" v-if="rVersion"> v{{ rVersion }}</span>
        </div>
        
        <div class="header-right">
          <div class="user-info-wrapper" ref="userInfoWrapperRef">
            <span class="user-name" @click="onOpenUserInfoSettings">{{ currentNickname }}</span>
          </div>
        </div>
      </div>
      
      <!-- Contet -->
      <div class="page-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Sidebar from '@/views/floating/Sidebar.vue';
import { formatDateTime } from '@/utils/formatter';

const route  = useRoute();

const rIsSidebarOpen = ref(false);
const rVersion       = ref('');


const currentNickname = computed(() => {
  return "Hero";
});


const currentTitle = computed(() => {
  const path = route.path;
  if (path.includes('/files')) {
    return 'Library';
  }
  else {
    return 'Inicio';
  }
});


const onToggleSidebar = () => {
  rIsSidebarOpen.value = !rIsSidebarOpen.value;
};


const onOpenUserInfoSettings = () => {
  console.log("Jump to User Info Page!");
};

const onCloseSidebar = () => {
  rIsSidebarOpen.value = false;
};


watch(() => route.path, () => {
  rIsSidebarOpen.value = false;
});


onMounted(async () => {
  console.log("MainLayout Mounted!!!");
  try {
    rVersion.value = "0.1"
  } catch (e) {
    console.warn('Failed to Get Version Number:', e);
  }
});


onUnmounted(() => {

});
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  margin: 0;
  padding: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
  min-width: 0;
}

.content.sidebar-open {
  margin-left: 200px;
}

.top-bar {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 2px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.hamburger-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
}

.hamburger-btn:hover {
  background-color: #40a9ff;
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

.main-title {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-area {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.version-text {
  font-size: 11px;
  color: #bbb;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-block;
}

.user-name:hover {
  border-color: #d0d0d0;
  background-color: #f5f5f5;
}

/* 用户信息下拉弹窗 */
.user-info-wrapper {
  position: relative;
}

.user-info-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 260px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 1000;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.item-label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
}

.item-value {
  font-size: 13px;
  color: #303133;
  font-weight: 600;
  text-align: right;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.username-edit-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.username-input {
  width: 120px;
  padding: 4px 8px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
}
.profile-btn {
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  line-height: 1.4;
  transition: all 0.15s;
}
.edit-btn {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.edit-btn:hover {
  color: #fff;
  background: #409eff;
  border-color: #409eff;
}
.edit-btn:active {
  background: #3a8ee6;
}
.save-btn {
  color: #fff;
  background: #67c23a;
  border-color: #67c23a;
}
.save-btn:hover {
  background: #85ce61;
  border-color: #85ce61;
}
.save-btn:active {
  background: #5daf34;
}
.cancel-btn {
  color: #909399;
  background: #f4f4f5;
  border-color: #e9e9eb;
}
.cancel-btn:hover {
  color: #fff;
  background: #909399;
  border-color: #909399;
}
.cancel-btn:active {
  background: #7d7d82;
}

.vip-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
  background-color: #e0e0e0;
  color: #666;
  transition: all 0.2s ease;
  cursor: pointer;
  letter-spacing: 0.5px;
  border: 1px solid #d0d0d0;
}

.vip-badge.vip-active {
  background-color: #ffd700;
  color: #333;
  border-color: #ffc107;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}

/* VIP弹窗样式 */
.vip-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.vip-modal {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
}

.vip-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.vip-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
  outline: none;
}

.close-btn:hover {
  color: #333;
}

.vip-modal-body {
  padding: 20px;
}

.vip-renewal p,
.vip-purchase p {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
}

.vip-plans {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vip-plan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.vip-plan.featured {
  border-color: #ffd700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 237, 78, 0.05));
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.15);
}

.plan-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
}

.vip-plan:hover {
  border-color: #ffd700;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
}

.vip-plan h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.vip-plan .price {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #666;
}

.buy-btn {
  padding: 8px 16px;
  border: 1px solid #ffd700;
  border-radius: 6px;
  background-color: #ffd700;
  color: #333;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.buy-btn:hover {
  background-color: #ffed4e;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}

/* 二维码支付区域样式 */
.qr-code-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qr-header {
  margin-bottom: 20px;
}

.qr-header h4 {
  margin: 10px 0 0 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.back-btn {
  background: none;
  border: none;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #66b1ff;
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-code-wrapper {
  width: 200px;
  height: 200px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-loading {
  color: #909399;
  font-size: 14px;
}

.order-info {
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  width: 100%;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.order-amount {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #ff4757;
}

.order-no {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #909399;
  word-break: break-all;
}

.expire-time {
  margin: 0;
  font-size: 12px;
  color: #e6a23c;
}

.countdown {
  font-size: 16px;
  font-weight: 700;
  color: #ff4757;
  font-family: 'Courier New', monospace;
}

.payment-status {
  width: 100%;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: #f0f9ff;
}

.status-waiting {
  font-size: 14px;
  color: #409eff;
  animation: pulse 2s infinite;
}

.status-success {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #f0f0f0;
  color: #666;
}

.status-badge.active {
  background-color: #ffd700;
  color: #333;
  font-weight: 600;
}

.logout-btn {
  padding: 8px 18px;
  background-color: #ffffff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #f5f7fa;
  border-color: #1890ff;
  color: #1890ff;
}

/* 页面内容区域 */
.page-content {
  flex: 1;
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>