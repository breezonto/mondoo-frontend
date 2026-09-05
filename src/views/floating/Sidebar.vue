<template>
  <div class="sidebar" :class="{ 'show': isOpen }" id="sidebar">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="_createNewSession">New Session</button>
    </div>
    
    <div class="history-list">
      <!-- Dynamic Menu -->
      <div v-for="section in menuSections" :key="section.path" class="menu-section">
        <!-- Parent Menu（expandable） -->
        <template v-if="section.type === 'parent'">
          <div class="menu-header parent-header" @click="toggleParent(section.id)">
            <span class="menu-icon">{{ _getMenuIcon(section.path) }}</span>
            <span class="menu-text">{{ section.name }}</span>
            <span class="dropdown-arrow" :class="{ rotate: isParentOpen(section.id) }">▶</span>
          </div>
          <div v-if="isParentOpen(section.id)" class="child-menus">
            <div
              v-for="child in section.children"
              :key="child.path"
              class="child-menu-item"
              @click="_navigate(child.path)"
            >
              <span class="child-icon">{{ _getMenuIcon(child.path) }}</span>
              <span class="child-text">{{ child.name }}</span>
            </div>
          </div>
        </template>

        <!-- Independent Menu -->
        <template v-else>
          <div class="menu-header" @click="_navigate(section.path)">
            <span class="menu-icon">{{ _getMenuIcon(section.path) }}</span>
            <span class="menu-text">{{ section.name }}</span>
            <span v-if="section.path === '/history'" class="dropdown-arrow" :class="{ rotate: rIsHistoryOpen }">➡</span>
          </div>

          <!-- Chat History (Recents) -->
          <div v-if="section.path === '/history' && rIsHistoryOpen" class="history-list">
            <div
              class="history-item"
              v-for="(history, index) in rHistoryItems"
              :key="index"
              @click="_selectHistory(index)"
            >
              <div class="history-item-content">
                <!-- Normal history item -->
                <template v-if="rRenamingHistoryIdx !== index">
                  <div class="history-item-text">
                    {{ history.note !== "" ? history.note : history.id }}
                  </div>

                  <button
                    class="history-context-btn"
                    @click.stop="_openHistoryContextMenu(index, $event)"
                    aria-label="History options"
                  >
                    ⋮
                  </button>
                  
                  <!-- Context menu -->
                  <Teleport to="body">
                    <div
                      v-if="rCurrCxtMenuIdx === index"
                      class="history-context-menu"
                      :style="{
                        top: `${rContextMenuPosition.top}px`,
                        left: `${rContextMenuPosition.left}px`
                      }"
                      @click.stop
                    >
                      <div
                        class="context-menu-item"
                        @click="_renameHistory(index)"
                      >
                        Rename
                      </div>

                      <div
                        class="context-menu-item delete"
                        @click="_deleteHistory(index)"
                      >
                        Delete
                      </div>
                    </div>
                  </Teleport>

                </template>

                <!-- Rename mode -->
                <template v-else>

                  <input
                    v-model="rRenameText"
                    class="history-rename-input"
                    @click.stop
                    @keydown.enter.stop="_confirmRenameHistory(index)"
                    @keydown.esc.stop="_cancelRenameHistory"
                    autofocus
                  />

                  <button
                    class="history-rename-confirm"
                    @click.stop="_confirmRenameHistory(index)"
                    aria-label="Confirm rename"
                  >
                    ✓
                  </button>

                  <button
                    class="history-rename-cancel"
                    @click.stop="_cancelRenameHistory"
                    aria-label="Cancel rename"
                  >
                    ×
                  </button>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter }                       from 'vue-router';

import { loadFileList }                       from '@/cxtmgr/library';
import type { FileDesc }                      from "@/cxtmgr/library"
import { 
  loadChatHistory, 
  deleteChatHistory, 
  updateChatHistoryNote, 
  type HistoryDesc 
}  from '@/cxtmgr/session';

import eventBus                           from '@/utils/eventBus';

const router           = useRouter();

const rFileList        = ref<FileDesc[]>([]);
const rMenuList        = ref<Menu[]>([]);
const rExpandedParents = ref<Set<number>>(new Set());

const menuSections = computed(() => {
  const parents   = rMenuList.value.filter(m => m.parentId === 0);
  const children  = rMenuList.value.filter(m => m.parentId && m.parentId > 0);
  const parentIds = new Set(children.map(c => c.parentId));

  return parents.map(p => {
    if (parentIds.has(p.id)) {
      return { 
        type: 'parent' as const, 
        ...p, 
        children: children.filter(c => c.parentId === p.id).sort((a, b) => a.sortOrder - b.sortOrder) 
      };
    }

    return { 
      type: 'leaf' as const, 
      ...p, 
      children: [] as Menu[] 
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder);
});


const toggleParent = (id: number | undefined) => {
  if (id === undefined) return;
  const s = new Set(rExpandedParents.value);
  if (s.has(id)) s.delete(id); else s.add(id);
  rExpandedParents.value = s;
};

const isParentOpen = (id: number | undefined): boolean => {
  if (id === undefined) return false;
  return rExpandedParents.value.has(id);
};


interface Menu {
  id?       : number;
  parentId? : number;
  name      : string;
  path      : string;
  sortOrder : number;
}

const { isOpen } = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'createNewChat'): void;
  (e: 'selectHistory', history: HistoryDesc): void;
  (e: 'fileUploadChange', urls: string[]): void;
  (e: 'navigateToFileList'): void;
}>();

const rHistoryItems  = ref<HistoryDesc[]>([]);
const rIsHistoryOpen = ref(false);

const rRenameText         = ref('');
const rRenamingHistoryIdx = ref<number | null>(null);

const rCurrHistoryItem = ref<HistoryDesc | null>(null);
const rCurrHistoryId   = ref<string | null>(null);
const rCurrCxtMenuIdx  = ref<number | null>(null)

const rContextMenuPosition = ref({
  top: 0,
  left: 0,
});

const _toggleHistory = () => {
  rIsHistoryOpen.value = !rIsHistoryOpen.value;
};


const _createNewSession = async () => {
  router.push({path: '/'});
  emit('close');
};


const _selectHistory = (index: number) => {
  if (index < 0 || index >= rHistoryItems.value.length) {
    return;
  }
  
  const history = rHistoryItems.value[index];

  if (!history) {
    return;
  }
  
  if (!history.id) {
    return;
  }
  
  rCurrHistoryItem.value = history;
  rCurrHistoryId.value     = history.id;

  router.push({
    path: '/',
    query: { 
      historyId : history.id 
    }
  });
  
  emit('close');
};


function _openHistoryContextMenu(index: number, event: MouseEvent) {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();

  rCurrCxtMenuIdx.value = index;

  rContextMenuPosition.value = {
    top: rect.bottom + 4,
    left: rect.right - 120,
  };
}


const _closeHistoryContextMenu = () => {
  rCurrCxtMenuIdx.value = null
}


const _renameHistory = (index: number) => {
  const history = rHistoryItems.value[index];

  if (!history) {
    return;
  }

  rRenamingHistoryIdx.value = index;
  rRenameText.value = history.note || history.id;


  _closeHistoryContextMenu();
};


const _confirmRenameHistory = async (index: number) => {
  const history = rHistoryItems.value[index];

  if (!history) {
    return;
  }

  const newName = rRenameText.value.trim();

  if (!newName) {
    return;
  }

  history.note = newName;

  // TODO: persist the renamed note to your backend
  // await updateChatHistory(history.id, newName);
  updateChatHistoryNote(history.id, history.note);

  rRenamingHistoryIdx.value = null;
  rRenameText.value = '';
};


const _cancelRenameHistory = () => {
  rRenamingHistoryIdx.value = null;
  rRenameText.value = '';
};


const _deleteHistory = async (index: number) => {
  const history   = rHistoryItems.value[index]
  const historyId = history.id;

  deleteChatHistory(historyId);

  // reload chat history
  rHistoryItems.value = await loadChatHistory();
  
  _closeHistoryContextMenu()
}


const _loadEntries = async () => {
  console.log("Loading Menu List");

  try {
    const response = {
      data: [
        {
          id        : 1,
          parentId  : 0,
          name      : "Library",
          path      : '/library',
          sortOrder : 0
        },
        {
          id        : 2,
          parentId  : 0,
          name      : "Recents",
          path      : '/history',
          sortOrder : 1
        }
      ]
    }
    if (response && response.data) {
      rMenuList.value = response.data.sort((a: Menu, b: Menu) => {
        return a.sortOrder - b.sortOrder;
      });
    } else {
      rMenuList.value = [];
    }
  } catch (error) {
    console.error('Failed to Load Sidebar Menu', error);
    rMenuList.value = [];
  }
};


const _getMenuIcon = (path: string): string => {
  switch (path) {
    case '/library':
      return '📁';
    case '/history':
      return '📚';
    case '/menu':
      return '☰';
    default:
      return 'X';
  }
};


const _navigate = (path: string) => {
  let actualPath      = path;
  let isMenuDeveloped = true;
  
  console.log("Current Path:", path)

  actualPath = path;
  
  if (actualPath === '/history') {
    return _toggleHistory();
  }

  if (isMenuDeveloped) {
    router.push({
      path  : actualPath,
    });
    emit('close');
  }
};


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Below event functions /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


watch(() => eventBus.fileUploaded.value, async (newValue) => {
  if (newValue) {
    rFileList.value = await loadFileList();
  }
});


watch(() => eventBus.sessionSent.value, async (newValue) => {
  console.log("Create New Session Tab");
  if (newValue) {
    rHistoryItems.value = await loadChatHistory();
  }
});


onMounted(async () => {
  _loadEntries();
  rHistoryItems.value = await loadChatHistory();
  
  document.addEventListener('click', _closeHistoryContextMenu)
});


onUnmounted(() => {
  document.removeEventListener('click', _closeHistoryContextMenu)
})


</script>

<style scoped>
.sidebar {
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.sidebar:not(.show) {
  width: 0;
  overflow: hidden;
}

.sidebar.expanded {
  width: 200px;
  overflow: visible;
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #fafafa;
}

.new-chat-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
  width: 100%;
}

.new-chat-btn:hover {
  background-color: #40a9ff;
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

.history-list {
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}

.menu-section {
  margin-top: 4px;
}

.menu-header {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 3px solid transparent;
  position: relative;
  transition: all 0.2s ease;
  color: #333;
}

.dropdown-arrow {
  margin-left: auto;
  font-size: 20px;
  transition: transform 0.2s ease;
  opacity: 0.5;
  color: #0f0f0f;
}

.dropdown-arrow.rotate {
  transform: rotate(90deg);
}

.menu-header:hover {
  background-color: #f0f7ff;
  border-left-color: #1890ff;
  color: #1890ff;
}

.parent-header {
  border-left-color: transparent;
  background-color: #fafafa;
}

.parent-header:hover {
  border-left-color: #1890ff;
}

.child-menus {
  overflow: hidden;
}

.child-menu-item {
  padding: 10px 16px 10px 48px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  color: #555;
}

.child-menu-item:hover {
  background-color: #f0f7ff;
  border-left-color: #1890ff;
  color: #1890ff;
}

.child-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.child-text {
  flex: 1;
  font-weight: 400;
}

.menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.menu-text {
  color: #333;
  font-weight: 500;
  flex: 1;
}

.history-item {
  position: relative;
  padding: 10px 16px 10px 44px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: #f2f6fc;
}

.history-item-content {
  position: relative;

  display: flex;
  align-items: center;
  gap: 8px;

  width: 100%;
  min-width: 0;
}

.history-item-text {
  flex: 1;
  min-width: 0;

  color: #1d2129;
  line-height: 1.4;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-context-btn {
  flex-shrink: 0;

  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;
  border: none;
  border-radius: 5px;

  background: transparent;
  color: #606266;

  font-size: 18px;
  line-height: 1;
  cursor: pointer;

  opacity: 0;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.history-item:hover .history-context-btn,
.history-context-btn:focus {
  opacity: 1;
}

.history-context-btn:hover {
  background-color: #e4e7ed;
}

/* Context menu */
.history-context-menu {
  position: fixed;

  min-width: 120px;

  padding: 4px 0;

  background: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  z-index: 9999;
}

.context-menu-item {
  padding: 8px 12px;

  color: #303133;
  font-size: 13px;
  line-height: 1.4;

  cursor: pointer;
  white-space: nowrap;

  transition: background-color 0.15s ease;
}

.context-menu-item:hover {
  background-color: #f2f6fc;
}

.context-menu-item.delete {
  color: #f56c6c;
}

.context-menu-item.delete:hover {
  background-color: #fef0f0;
}

.history-rename-input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 4px 8px;
  border: 1px solid #409eff;
  border-radius: 5px;
  outline: none;
  background: #ffffff;
  color: #1d2129;
  font-size: 13px;
  line-height: 1.4;
  box-sizing: border-box;
}

.history-rename-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
}

.history-rename-confirm,
.history-rename-cancel {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
}

.history-rename-confirm {
  background: #ecf5ff;
  color: #409eff;
}

.history-rename-confirm:hover {
  background: #d9ecff;
}

.history-rename-cancel {
  background: #f5f7fa;
  color: #909399;
}

.history-rename-cancel:hover {
  background: #e4e7ed;
}


.modality-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modality-modal {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.modal-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
  text-align: center;
}

.modality-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.modality-item {
  padding: 12px 16px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.modality-item:hover {
  background-color: #f7f8fa;
  border-color: #dcdfe6;
}

.modality-code {
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 4px;
}

.modal-close-btn {
  width: 100%;
  padding: 10px;
  background-color: #f5f7fa;
  color: #303133;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background-color: #ecf5ff;
  border-color: #c6e2ff;
  color: #409eff;
}
</style>
