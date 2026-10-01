////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// css style config ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
<style scoped>
.chat-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-section {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 #f0f0f0;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 75%;
  animation: fadeIn 0.3s ease-in-out;
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

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.bubble {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  text-align: left;

  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.message.user .bubble {
  background-color: #f0f0f0;
  color: #333;
  border-radius: 12px;
  text-align: left;
}

.message.assistant .bubble {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  text-align: left;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}
.message.user .message-meta {
  flex-direction: row-reverse;
}

.copy-btn {
  cursor: pointer;
  font-size: 14px;
  opacity: 0.5;
  transition: opacity 0.2s;
  user-select: none;
}
.copy-btn:hover {
  opacity: 1;
}

.chat-type-label {
  font-size: 12px;
  color: #999;
}

.msg-time {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}
.message.user .msg-time {
  margin-left: 0;
  margin-right: auto;
}

/* Markdown 内容样式 */
.bubble h1,
.bubble h2,
.bubble h3,
.bubble h4,
.bubble h5,
.bubble h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.2;
}

.bubble h1 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.bubble h2 {
  font-size: 1.3em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.bubble h3 {
  font-size: 1.1em;
}

.bubble h4 {
  font-size: 1em;
}

.bubble h5 {
  font-size: 0.9em;
}

.bubble h6 {
  font-size: 0.8em;
  color: #6a737d;
}

.bubble p {
  margin-top: 0;
  margin-bottom: 1em;
}

.bubble ul,
.bubble ol {
  margin-top: 0;
  margin-bottom: 1em;
  padding-left: 2em;
}

.bubble li {
  margin-top: 0.25em;
}

.bubble code {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.85em;
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  color: #e74c3c;
}

.bubble pre {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  margin-top: 0;
  margin-bottom: 1em;
}

.bubble pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.bubble blockquote {
  border-left: 4px solid #dfe2e5;
  padding: 0 1em;
  color: #6a737d;
  margin-top: 0;
  margin-bottom: 1em;
}

.bubble a {
  color: #0366d6;
  text-decoration: none;
}

.bubble a:hover {
  text-decoration: underline;
}

.bubble img {
  max-width: 100%;
  height: auto;
  border-radius: 3px;
}

.bubble table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 0;
  margin-bottom: 1em;
}

.bubble th,
.bubble td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.bubble th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.bubble tr:nth-child(even) {
  background-color: #f6f8fa;
}

/* 气泡内文件链接 */
.inline-fl {
  color: #1890ff;
  text-decoration: underline;
  cursor: pointer;
}
.inline-fl:hover {
  color: #40a9ff;
}
.inline-fl-pending {
  color: #1890ff;
  text-decoration: underline;
  opacity: 0.85;
}

.ai-disclaim {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  padding: 0 0 12px 0;
  flex-shrink: 0;
}

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

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.input-type-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.input-type-select {
  flex: 1;
  min-width: 0;
  max-width: 300px;
}

.input-type-selector label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.input-type-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s;
}

.input-type-select:focus {
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
  <div class="chat-view">
    <div class="chat-section">
      <div class="chat-container" ref="chatContainer">
        <div class="message" v-for="(message, index) in rDisplayMessages" 
          :key   = "index"
          :class = "message.role"
        >
          <div class="avatar">
            {{avatars_list[message.role]}}
          </div>
          
          <div class="message-content">
            <div class="bubble" v-html="rProcessedMessages[index]?.content || message.content"
              @click="onClickBubble" 
            >
            </div>
            <div class="message-meta">
              <span class="copy-btn" title="copy" @click="onCopyMessage(message.content)">📋</span>
              <span class="chat-type-label" v-if="message.modeName != null">
                {{ getChatModeDisplayName(message.modeName) }}
              </span>
              <span class="msg-time" v-if="message.time">
                {{ message.time }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="rIsLoading" class="message ai">
          <div class="avatar">🤖</div>
          <div class="bubble">Thinking...</div>
        </div>
      </div>
    </div>

    <InputBench
      @send-message="_forwardRound"
    />
  </div>
</template>


<script setup lang="ts">

import { ref, watch, nextTick, onMounted } from 'vue';

import eventBus from '@/cxtmgr/eventBus.ts';

import { generateChatCompletion }          from '@/api/chat.ts';
import { formatMsgTime, formatMessageContent } from '@/utils/formatter.ts';
import type { QueryMode, }    from '@/cxtmgr/session.ts';


import { 
  Session,
  avatars_list, 
  ChatRole, 
  loadQueryModes, 
  loadChatHistory 
}
from '@/cxtmgr/session.ts';
import InputBench from './gadgets/InputBench.vue';


////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Reactive Values ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const emit = defineEmits<{
  (e: 'adjustTextareaHeight', event: Event): void;
  (e: 'handleWelcomeStart', data: { message: string; chatType: string }): void;
  (e: 'openFileLink', fileId: string, fileName: string): void;
}>();

const rChatContainer     = ref<HTMLElement | null>(null);
const rProcessedMessages = ref<Array<{ content: string }>>([]);

const rCurrSession     = ref<Session>();
const rCurrMsgIdx      = ref<number>(0);
const rCurrInputMsg    = ref("");
const rQueryModes      = ref<QueryMode[]>([]);
const rCurrQueryMode   = ref('');
const rIsLoading       = ref(false);
const rIsStreaming     = ref(true);
const rDisplayMessages = ref<DisplayMessage[]>([]);


const props = defineProps<{
  isLoading        : boolean;
  currQueryMode    : string,
  currMessage      : string,
  currMsgHistoryId : string,
}>();


////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Internal Functions and interface /////////////////////////
////////////////////////////////////////////////////////////////////////////////////

export interface DisplayMessage {
  role          : string;
  content       : string;
  modeName?     : string | null;
  time?         : string;
  fileLinks?    : Array<{ text: string; fileId: string; fileName: string }>;
}


const _prepareConversation = async (modeName : string, message : string) => {
  rCurrInputMsg.value  = message;
  rIsStreaming.value   = true;
  
  if (props.currMsgHistoryId !== null && props.currMsgHistoryId !== undefined)
    rCurrSession.value = new Session(props.currMsgHistoryId);
};


/**
 * @TODO comment
 * @param content
 * @param role
 * @param modeName
 * @param time
 */

const _createBubble = (
  content  : string, 
  role     : ChatRole, 
  modeName : string,
  time     : string
) => {
  rDisplayMessages.value.push({
    role     : role,
    content  : content,
    modeName : modeName,
    time     : time
  });
};


const _cleanMsgBubbles = (
) => {
  rDisplayMessages.value.length = 0;
}


const _displayMsgHistory = async () => {
  const history = await loadChatHistory(props.currMsgHistoryId);
  console.log("Loaded History from Storage:", history);
  
  if (history.length > 0) {
    const messages = history[0].messages;
    for (const message of messages) {
      _createBubble(
        message.content, 
        message.role as ChatRole, 
        'chat', 
        formatMsgTime(new Date())
      );
    }
  }
}


/**
 * @TODO comment
 * @param _msgIdx 
 * @param messages 
 * @param resp 
 */
const _displayStreamingMessage = async (
    _msgIdx   : number,
    messages : DisplayMessage[],
    resp     : Response
) : Promise<number> => {
  try {
    // Handle streaming response
    const reader = resp.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return _msgIdx;

    let slicedMessage = "";
    
    _msgIdx = messages.length - 1;

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (true) {
            const idx = buffer.indexOf("\n");
            if (idx === -1) break;

            const line = buffer.slice(0, idx).trim();
            buffer     = buffer.slice(idx + 1);

            if (!line) continue;

            const obj = JSON.parse(line);

            slicedMessage += obj.choices[0].message.content;
            messages[_msgIdx].content = slicedMessage;
        }
    }
  } 
  catch (err) {
    console.error(err);
  }

  return _msgIdx;
};


/**
 * 
 */
const _forwardRound = async (currMessage: string) => {
  if (!currMessage) return;

  console.log("Current User Query:", currMessage);

  const query_message = currMessage;

  _createBubble(
    query_message,
    ChatRole.user,
    rCurrQueryMode.value,
    formatMsgTime(new Date())
  );

  rCurrSession.value?.pushMessageToHistory(
    ChatRole.user,
    query_message
  );

  try {
    const response = await generateChatCompletion(
      rCurrSession.value?.getLatestMsg() || [],
      rIsStreaming.value,
      rCurrSession.value?.msgHistoryId
    );

    _createBubble(
      "",
      ChatRole.assistant,
      rCurrQueryMode.value,
      formatMsgTime(new Date())
    );

    rCurrMsgIdx.value = await _displayStreamingMessage(
      rCurrMsgIdx.value,
      rDisplayMessages.value,
      response
    );

    rCurrSession.value?.pushMessageToHistory(
      ChatRole.assistant,
      rDisplayMessages.value[rCurrMsgIdx.value].content
    );
  } catch (err) {
    _createBubble(
      "Sorry, something went wrong while generating the response.",
      ChatRole.assistant,
      rCurrQueryMode.value,
      formatMsgTime(new Date())
    );
  } finally {
    rIsLoading.value = false;
  }
};


const _postProcessMessages = async (displayMessages : DisplayMessage[]) => {
  const processed = await Promise.all(
    displayMessages.map(async (message) => {
      const content = await formatMessageContent(message.content, message.fileLinks);
      return { content };
    })
  );
  rProcessedMessages.value = processed;
};


/**
 * @TODO comment
 */
const _scrollToBottom = () => {
  nextTick(() => {
    if (rChatContainer.value) {
      rChatContainer.value.scrollTop = rChatContainer.value.scrollHeight;
    }
  });
};


const getChatModeDisplayName = (modeName: string): string => {
  const  mode = rQueryModes.value.find(m => m.modeName === modeName);
  return mode ? mode.displayName : modeName;
};


const openFileLink = (fileId: string, fileName: string) => {
  emit('openFileLink', fileId, fileName);
};


const handleClickBubble = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const link = target.closest('.inline-fl') as HTMLElement;
  if (link) {
    e.preventDefault();
    const fileId = link.dataset.fid;
    const fileName = link.dataset.fname;
    if (fileId && fileName) {
      openFileLink(fileId, fileName);
    }
  }
};


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Event functions ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/**
 * @TODO comment
 * @param e 
 */
const onClickBubble = (e: MouseEvent) => {
  handleClickBubble(e)
};


/**
 * @TODO comment
 * @param content: 文本内容 
 */
const onCopyMessage = (content: string) => {
  navigator.clipboard.writeText(content).then(() => {
    // 复制成功静默处理
  }).catch(() => {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
};


/**
 * @TODO comment
 */
watch(() => rDisplayMessages, async () => {
  await _postProcessMessages(rDisplayMessages.value);
  _scrollToBottom();
  setTimeout(() => _scrollToBottom(), 350);
}, { deep: true, immediate: true });


/**
 * @TODO comment
 */
watch(() => props.isLoading, () => {
  _scrollToBottom();
});


/**
 * @TODO comment
 */
watch(() => props.currMsgHistoryId, async () => {
  console.log("props.currMsgHistoryId updated:", props.currMsgHistoryId);

  _cleanMsgBubbles();
  _displayMsgHistory();
}); 


/**
 * @TODO comment
 */
watch(rCurrSession, async () => 
{
  rCurrSession.value?.storeMessageHistory();
}, { deep: true }
);


/**
 * @TODO comment
 * @param data: message
 */
const startChat = async (
  data: { message: string; queryMode: string } | undefined = undefined,
) => {
  console.log("onBeginConversation:", data)
  
  if (data) {
    await _prepareConversation(data.queryMode, data.message.trim())
    await _forwardRound(data.message);
  }

  eventBus.triggerSessionSent();
  _scrollToBottom();
};


/**
 * @TODO comment
 */
onMounted(async () => {
  rQueryModes.value = await loadQueryModes();
  
  if (props.currQueryMode) {
    console.log("props.currQueryMode", props.currQueryMode);
    rCurrQueryMode.value = props.currQueryMode;
  } 
  else {
    rCurrQueryMode.value = 'chat';
  }
  
  _displayMsgHistory();

  startChat({message: props.currMessage, queryMode: props.currQueryMode});
});
</script>
