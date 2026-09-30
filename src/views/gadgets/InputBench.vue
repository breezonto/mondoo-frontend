<style scoped>

.input-area {
  transform : translateX(-50%);
  position  : absolute;
  left      : 50%;
  bottom    : 5%;
  width     : min(840px, calc(100% - 40px));
  
  margin    : 0 auto;
  
  background-color: #f5f6f5;
  
  border-radius : 8px;
  box-shadow    : 0 5px 8px rgba(0, 0, 0, 0.1);
  padding       : 16px;
}

.input-wrapper {
  display: flex;
  /* flex-direction: row; */
  align-items: flex-end;
  gap: 12px;
}

.input-wrapper textarea {
  flex: 1;
  min-width: 0;
}

textarea {
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    line-height: 1.5;
    resize: none;
    overflow-y: auto;
    overflow-x: hidden;
    font-family: inherit;
    transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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
</style>

<template>
    <div class="input-area">
        <div class="input-wrapper">
            <textarea 
                :value="rCurrInput" 
                @input="(e) => {
                    rCurrInput = (e.target as HTMLTextAreaElement).value; 
                    onAdjustTextareaHeight(e);
                }"
                @keydown.enter = "onEnterKeyDown"
                placeholder="Typing here..."
                :style="{ height: rTextareaHeight + 'px' }">
            </textarea>
            <button 
                class="send-btn" 
                :disabled="!rCurrInput.trim()" 
                @click         = "onSendMessage">Send
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const MIN_TEXTAREA_HEIGHT = 75;
const MAX_TEXTAREA_HEIGHT = 400;

const rTextareaHeight = ref(MIN_TEXTAREA_HEIGHT);
const rCurrInput  = ref("");

const emit = defineEmits<{
 (e: 'sendMessage', message: string): void;
}>
();
/**
 * @TODO comment
 * @param e 
 */
const onAdjustTextareaHeight = (e: Event) => {
  const textarea = e.target as HTMLTextAreaElement;

  // Temporarily reset so scrollHeight represents the actual content height
  textarea.style.height = `${MIN_TEXTAREA_HEIGHT}px`;

  const contentHeight = textarea.scrollHeight;

  // Don't change height until content actually needs more space
  rTextareaHeight.value = Math.max(
    MIN_TEXTAREA_HEIGHT,
    Math.min(contentHeight, MAX_TEXTAREA_HEIGHT)
  );
};


const onEnterKeyDown = async (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    await onSendMessage();
  }
};

const onSendMessage = async () => {
   rCurrInput.value.trim() && emit("sendMessage", rCurrInput.value);
};

</script>