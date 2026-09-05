<template>
  <div class="file-library-view">
    <div class="toolbar-section">
      <div class="search-section">
        <SearchBox />
      </div>
      
      <div class="file-import-section">
        <FileUploader />
      </div>
    </div>

    <div class="file-table-container">
      <div class="batch-bar" v-if="rSelectedFileIds.size > 0">
        <span class="batch-info"> {{ rSelectedFileIds.size }} Item(s) Selected</span>
        <button class="batch-delete-btn" @click="onBatchDeleteFiles">Delete in Batch</button>
        <button class="clear-btn" @click="rSelectedFileIds.clear()">Cancel</button>
      </div>
      <div class="file-table-wrapper">
        <table class="file-table">
          <thead>
          <tr>
            <th class="checkbox-col">
              <input type="checkbox" :checked="isAllSelected" @change="onSelectAll" />
            </th>
            <th>No.</th>
            <th>File Name</th>
            <th>Extension</th>
            <th>File Size</th>
            <th>
              Status
              <span
                class="info-icon"
                @click="rShowStageInfoMode = true"
                style="
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  background-color: #f0f0f0;
                  color: #666;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 16px;
                  font-size: 12px;
                  margin-left: 4px;
                  cursor: pointer;
                  vertical-align: middle;
                "
              >
                ?
              </span>
            </th>
            <th>Creation Time (UTC+0)</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in rFdDisplayList" :key="file.id" :class="{ 'row-selected': rSelectedFileIds.has(file.fileId) }">
            <td class="checkbox-col" style="text-align: center;">
              <input type="checkbox" :checked="rSelectedFileIds.has(file.fileId)" @change="onToggleSelect(file.fileId)" />
            </td>
            <td>{{ index }}</td>
            <td>{{ file.stem }}</td>
            <td>{{ file.ext }}</td>
            <td>{{ formatFileSize(file.size) }}</td>
            <td>{{ file.stage }}</td>
            <td>{{ file.createAt }}</td>
            <td>
              <button class="action-btn preview-btn" @click="onPreviewFile(file)">Preview</button>
              <button class="action-btn edit-btn"    @click="onEditFile(file)">Edit</button>
              <button class="action-btn delete-btn"  @click="onDeleteFile(file.fileId)">Delete</button>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>
    
    <!-- Parsing Stage Popup -->
    <div v-if="rShowStageInfoMode" class="preview-modal-overlay" @click="rShowStageInfoMode = false">
      <div class="preview-modal" style="max-width: 400px;" @click.stop>
        <div class="preview-header">
          <h3>Note</h3>
          <button class="preview-close-btn" @click="rShowStageInfoMode = false">x</button>
        </div>
        <div class="preview-content" style="padding: 15px;">
          <div>
            <p>The Status of File</p>
            <ul style="margin-top: 8px; padding-left: 20px; font-size: 13px;">
              <li>DELTED: The File Is Deleted</li>
              <li>UPLOADING: The File Is Uploading</li>
              <li>UPLOADED: The File Is Uploaded</li>
              <li>PARSERD: The File Is Parsed</li>
              <li>ARCHIVED: The File Is Archived to Library</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { getFileList, deleteFile, batchDeleteFiles } from '@/api/file';

import eventBus           from '@/utils/eventBus';
import FileUploader       from '@/views/floating/FileUploader.vue';
import SearchBox          from '@/views/gadgets/SearchBox.vue';
import { formatFileSize } from '@/utils/formatter';

interface FdItemInDisplay {
  id          : number;
  fileId      : string;
  sourcePath  : string;
  targetPath  : string;
  stem        : string;
  ext         : string;
  size        : number;
  stage       : string;
  currSlice   : number;
  totalSlices : number;
  totalChunks : number;
  createAt    : string;
  updateAt    : string;
}


const rFdDisplayList     = ref<FdItemInDisplay[]>([]);
const rShowEditMode      = ref(false);
const rShowStageInfoMode = ref(false);
const rSelectedFileIds   = ref(new Set<string>());


const isAllSelected = computed(() => {
  return rFdDisplayList.value.length > 0 && rFdDisplayList.value.every(f => rSelectedFileIds.value.has(f.fileId));
});


const onToggleSelect = (fileId: string) => {
  const s = rSelectedFileIds.value;
  if (s.has(fileId)) {
    s.delete(fileId);
  } else {
    s.add(fileId);
  }

  rSelectedFileIds.value = new Set(s);
};


const onSelectAll = () => {
  if (isAllSelected.value) {
    rSelectedFileIds.value = new Set();
  } else {
    rSelectedFileIds.value = new Set(rFdDisplayList.value.map(f => f.fileId));
  }
};


const onPreviewFile = async (file: FdItemInDisplay) => {
  console.log("Start to Preview File", file);
}


const onEditFile = (file: FdItemInDisplay) => {
  console.log("Start to Edit File:", file);
  rShowEditMode.value = true;
};


const onDeleteFile = async (fileId: string) => {
  if (confirm('Delete This File?')) {
    try {
      const data = await deleteFile(fileId);
      console.log("Status", data.status)
      if (data && data.status == 'ok') {
        alert("File Deleted");
        await _loadFileList();
      } else {
        throw new Error(data.message || "Failed to delete the file");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to Delete The File, Retry";
      alert(errorMessage);
    }
  }
};


const onBatchDeleteFiles = async () => {
  const ids = Array.from(rSelectedFileIds.value);
  if (ids.length === 0) return;
  if (!confirm(`Delete Selected ${ids.length} File(s)?`)) return;
  try {
    const response = await batchDeleteFiles(ids);
    if (response && response.data && response.data.success) {
      alert(`Successfully Deleted ${ids.length} Files`);
      rSelectedFileIds.value = new Set();
      await _loadFileList();
      eventBus.triggerFileUploaded();
    } else {
      throw new Error(response.data.message || 'Failed to Delete the Batch');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to Delete the Batch, Please Retry';
    alert(errorMessage);
  }
};


const _loadFileList = async () => { 
  rFdDisplayList.value = []

  try {
    const fileList = await getFileList();
    console.log("File List Data:", fileList);

    for (const entry of fileList) {
      rFdDisplayList.value.push({
          id          : 0,
          fileId      : entry.file_id,
          sourcePath  : '',
          targetPath  : '',
          stem        : entry.filename,
          ext         : entry.type,
          size        : entry.size,
          stage       : entry.stage,
          currSlice   : 1,
          totalSlices : 1,
          totalChunks : entry.num_chunk,
          createAt    : entry.upload_time,
          updateAt    : ''
      });
    }
  }
  catch (error) {
    console.error('Failed to Load File List', error);
  }
};


onMounted(async () => {
  try {
    console.log("!!!!");
    await _loadFileList();
  } catch (error) {
    console.error('Call loadFileList Failed:', error);
  }
  
  watch(() => eventBus.fileUploaded.value, (newValue: boolean) => {
    if (newValue) {
      _loadFileList();
    }
  });

});

</script>

<style scoped>
.file-library-view {
  width: 100%;
  height: 100vh;
  max-width: 100%;
  max-height: 100%;
  padding: 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.file-import-section {
  flex-shrink: 0;
  margin-bottom: 20px;
}

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
  background: #1890ff;
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

.checkbox-col {
  width: 40px !important;
  text-align: center;
}

.checkbox-col input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #1890ff;
}

.row-selected {
  background-color: #e6f7ff !important;
}

.batch-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: #fffbe6;
  border-bottom: 1px solid #ffe58f;
  flex-shrink: 0;
}

.batch-info {
  font-size: 13px;
  color: #666;
}

.batch-delete-btn {
  padding: 5px 12px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.batch-delete-btn:hover {
  background: #ff7875;
}

.file-table-container {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-table-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.file-table th,

.file-table td {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.file-table th {
  font-weight: 600;
  color: #1d2129;
  font-size: 14px;
  background: #fafbfc;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
  vertical-align: middle;
}

.file-table td {
  white-space: normal;
  word-break: break-word;
}

.file-table th:first-child,

.file-table td:first-child {
  width: 60px;
}

.file-table td:last-child {
  white-space: normal !important;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  align-items: center;
}

.file-table tr:hover {
  background: #f7f8fa;
}

.no-files {
  padding: 40px;
  text-align: center;
  color: #909399;
}

.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #fff;
  background: #1890ff;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #40a9ff;
}

.action-btn:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
  opacity: 0.6;
}

.action-btn:disabled:hover {
  background-color: #d9d9d9;
}

.delete-btn {
  background-color: #ff4d4f;
}

.delete-btn:hover {
  background-color: #ff7875;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #f0f0f0;
  color: #666;
  border-radius: 50%;
  font-size: 12px;
  margin-left: 4px;
  cursor: pointer;
  vertical-align: middle;
}

.info-icon:hover {
  background: #e0e0e0;
}

.edit-modal-overlay,

.preview-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 10px;
}

.edit-modal,
.preview-modal {
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-modal {
  max-width: 1400px;
}

.preview-header {
  padding: 14px 18px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.preview-content {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.preview-loading {
  padding: 60px 40px;
  text-align: center;
  color: #909399;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: preview-spin 0.8s linear infinite;
}

@keyframes preview-spin {
  to { transform: rotate(360deg); }
}

.preview-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.form-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #1890ff;
  color: #fff;
  border: none;
}

.cancel-btn {
  background: #f5f7fa;
  border: 1px solid #ddd;
}

</style>