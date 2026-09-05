<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1 class="welcome-title">Mondooooo</h1>
      <p class="welcome-subtitle">I am your assistant, what can I help you?</p>

      <div class="quick-prompts">
        <span class="prompt-chip"
          v-for="(prompt, index) in promptRecommendation"
          :key="index"
          @click="selectQuickPrompt(prompt)"
        >
        {{ prompt }}
        </span>
      </div>

      <div class="input-area">
        <textarea 
          v-model="inputMessage" 
          @input="onTextInput"
          @keydown.enter="onEnterKey"
          placeholder="Typing here..."
          :style="{ height: textareaHeight + 'px' }"
        >
        </textarea>
        <button class="send-btn" 
            :disabled="!inputMessage.trim()"
            @click="onButtonClick">
            Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QueryMode } from '@/cxtmgr/session';
import { loadQueryModes } from '@/cxtmgr/session';

const emit = defineEmits<{
  (e: 'start', data: { message: string; queryMode: string }): void;
}>();


const inputMessage      = ref('');
const modeName          = ref('chat');
const chatModes         = ref<QueryMode[]>([]);
const textareaHeight    = ref(60);
const maxTextareaHeight = 200;


const promptRecommendation = [
  "What are there documents recently?",
  "What files are uploaded by this week?",
  "What you can do for me?",
  "How to upload files?",
  "What\'s the weather today?"
];


const selectQuickPrompt = (prompt: string) => {
  inputMessage.value = prompt;
  handleStartChat();
};


const handleStartChat = () => {
  const content = inputMessage.value.trim();
  if (!content) return;

  emit('start', {
    message: content,
    queryMode: modeName.value
  });
};


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Below event functions /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/**
 * 
 * @param event 
 */
const onEnterKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (inputMessage.value.trim()) {
      handleStartChat();
    }
  }
};

/**
 * 
 */
const onButtonClick = () => {
  handleStartChat();
};

/**
 * 
 * @param event 
 */
const onTextInput = (event: Event) => {
  const textarea        = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  const scrollHeight    = textarea.scrollHeight;
  textareaHeight.value  = Math.min(scrollHeight, maxTextareaHeight);
};


onMounted(async () => {
  console.log("WelcomeView Mounted!");
  chatModes.value = await loadQueryModes();
});

</script>


////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// css style config ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


<style scoped>
.welcome-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.welcome-content {
  text-align: center;
  max-width: 700px;
  width: 90%;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 12px 0;
}

.welcome-subtitle {
  font-size: 16px;
  color: #606266;
  margin: 0 0 24px 0;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 32px;
  padding: 0 16px;
}

.prompt-chip {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  user-select: none;
}

.prompt-chip:hover {
  background: #f0f4ff;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.prompt-chip:active {
  transform: scale(0.96);
}

.input-area {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  box-sizing: border-box;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

textarea:focus {
  border-color: #1890ff;
}


.send-btn {
  min-width: 60px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
  padding: 0 12px;

  /* Move to bottom of the flex container */
  align-self: flex-end;
}


.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  width: 100%;
  flex-wrap: wrap;
}

.input-type-selector {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  margin: 0;
  padding-right: 8px;
  box-sizing: border-box;
}

.input-type-selector label {
  font-size: 12px;
  color: #606266;
  margin-right: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.input-type-select {
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 12px;
  color: #1d2129;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  flex: 1;
  min-width: 0;
  width: 0;
  max-width: 200px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-type-select:focus {
  border-color: #1890ff;
}


</style>
