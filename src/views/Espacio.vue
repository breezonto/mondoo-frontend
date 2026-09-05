<template>
  <div class="agent-container">
    <WelcomeView v-if="rShowWelcome" 
      @start="onCommenceQuest"
    />
    <!-- Chat Session -->
    <ChatView v-else
      :is-loading="rIsLoading"
      :curr-query-mode="rCurrQueryMode"
      :curr-msg-history-id="rCurrMsgHistoryId"
      :curr-msg-content="rCurrMsgContent"
      :textarea-height="rTextareaHeight"
      @adjust-textarea-height="onAdjustTextareaHeight"
      @open-file-link="onOpenFileLink"
    />

    <!-- File Preview Popup -->
    <div v-if="rIsShowingPreview" class="preview-modal-overlay" @click="_closePreviewModal">
      <div class="preview-modal" @click.stop>
        <div class="preview-header">
          <h3>{{ rPreviewFileName }}</h3>
          <button class="preview-close-btn" @click="_closePreviewModal">x</button>
        </div>
        <div class="preview-content">
          <div v-if="rPreviewLoading" class="preview-loading">Lading...</div>
          <div v-html="rPreviewContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter }                from 'vue-router';

import { uuidv4 }   from '@/utils/rnd.ts';
import ChatView     from './ChatView.vue';
import WelcomeView  from './WelcomeView.vue';

const route  = useRoute();
const router = useRouter();

////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Reactive Values ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const rIsLoading        = ref(false);
const rTextareaHeight   = ref(60);
const rCurrQueryMode    = ref('')
const rShowWelcome      = ref(true);
const rCurrMsgHistoryId = ref<string>("");
const rCurrMsgContent   = ref<string>("");

const rIsShowingPreview     = ref(false);
const rPreviewFileName      = ref('');
const rPreviewContent       = ref('');
const rPreviewLoading       = ref(false);
const rCurrentPreviewFileId = ref('');
const rCurrentMsgIdx        = ref<number | null>(null);


const maxTextareaHeight : number = 200;
const historyIdPrefix   : string = "cmh-";


const _mutateQueryParams = async (
  rscId : string
) => {
  if (rscId !== undefined && rscId !== null) {
    rShowWelcome.value      = false;
    rCurrMsgHistoryId.value = rscId;
    
    if (rCurrQueryMode.value == '') {
      rCurrQueryMode.value = 'chat';
    }
  }
  else {
    rShowWelcome.value      = true;
  }

  console.log("rCurrMsgHistoryId.value (_mutateQueryParams):", rCurrMsgHistoryId.value)
};


// 关闭预览弹框
const _closePreviewModal = () => {
  rIsShowingPreview.value     = false;
  rPreviewContent.value       = '';
  rCurrentPreviewFileId.value = '';
};


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Below event functions /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * @param event 
 */
const onAdjustTextareaHeight = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  rTextareaHeight.value = Math.min(textarea.scrollHeight, maxTextareaHeight);
};


/**
 * trigger this event if click the "send" or press Enter in keyboard
 * @param data: message
 */
const onCommenceQuest = async (
  data: { message: string; queryMode: string }
) => {  
  rCurrQueryMode.value  = data.queryMode;
  rCurrMsgContent.value = data.message;
  
  const newMsgHistoryId = historyIdPrefix + uuidv4();

  console.log("Set Current history ID (inicio):", newMsgHistoryId);
  console.log("On Commence Quest:", data);

  await router.push({
    path: '/',
    query: {
      historyId: newMsgHistoryId
    }
  });
};


/**
 * click the file's link, preview the thumbnail
 * @param fileId 
 * @param fileName 
 */
const onOpenFileLink = async (
  fileId   : string, 
  fileName : string
) => {
};


/**
 * watch the change of URL and reload 
 */
watch(() => route.query, async () => 
{
  const historyId = route.query.historyId as string;

  rCurrentMsgIdx.value = null;
  rIsLoading.value     = false;
  
  await _mutateQueryParams(historyId)

}, { deep: true, immediate: true }
);


watch(() => route.path, async (newPath, oldPath) => 
{
  console.log(
    "route.path watcher fired (watch route.path)",
    new Date().toISOString(),
    "old:", oldPath,
    "new:", newPath
  );
}
);

/**
 * @TODO comment
 */
onMounted(async () => {
  console.log("Agent View Mounted!", new Date().toISOString());

  const historyId = route.query.historyId as string;
  await _mutateQueryParams(historyId);
});


/**
 * @TODO comment
 */
onUnmounted(() => {
  // ad-hoc
  // const historyId = historyIdDebug;
  // localStorage.removeItem(historyId);
  // console.log("Messages History Cleared")
});

</script>


////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// css style config ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


<style scoped>
.agent-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 预览弹框 */
.preview-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.preview-modal {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.preview-header {
  padding: 14px 18px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.preview-header h3 {
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 85%;
}
.preview-close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #999;
  padding: 0 4px;
  line-height: 1;
}
.preview-close-btn:hover {
  color: #333;
}
.preview-content {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}
.preview-loading {
  text-align: center;
  padding: 40px;
  color: #999;
}


/* 响应式设计 - 适配手机端 */
@media (max-width: 768px) {
  .agent-container {
    height: 100vh;
  }
  .preview-modal {
    max-width: 96vw;
    max-height: 90vh;
  }
}
</style>