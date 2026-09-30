import { ref } from 'vue';

// 创建事件总线
const eventBus = {
  // 文件上传成功事件
  fileUploaded: ref<boolean>(false),
  
  // 会话发送成功事件
  sessionSent: ref<boolean>(false),
  
  // 触发文件上传成功事件
  triggerFileUploaded() {
    this.fileUploaded.value = true;
    // 立即重置为 false，以便下次触发
    setTimeout(() => {
      this.fileUploaded.value = false;
    }, 100);
  },
  
  // 触发会话发送成功事件
  triggerSessionSent() {
    this.sessionSent.value = true;
    // 立即重置为 false，以便下次触发
    setTimeout(() => {
      this.sessionSent.value = false;
    }, 100);
  }
};

export default eventBus;