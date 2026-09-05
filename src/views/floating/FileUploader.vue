<template>
  <div class="file-uploader">
    <button
      class="upload-btn"
      @click="onTriggerFileInput"
      :disabled="rIsUploading"
    >
      {{ _showTextInUploadButton() }}
    </button>

    <!-- Parsing Method Selector -->
    <div v-if="rShowMethodSelector" class="modal-overlay" @click.self="onCloseModalityModal">
      <div class="modal">
        <h3>Choose Parsing Pipeline</h3>
        <div class="modality-list">
          <div
            v-for="modality in rFileModalities"
            :key="modality.code"
            class="modality-item"
            @click="onSelectModality(modality)"
          >
            <div class="modality-code">{{ modality.code }}</div>
            <div class="modality-desc">{{ modality.desc }}</div>
          </div>
        </div>
        <button class="cancel-btn" @click="onCloseModalityModal">Cancel</button>
      </div>
    </div>

    <!-- Pending File Popup -->
    <div v-if="rIsShowPendingFiles" class="modal-overlay" @click.self="onClosePendingMode">
      <div class="modal precheck-modal">
        <h3>Pending Files Number: {{ rPendingFilesStates.length }}</h3>
        <div class="pending-file-list">
          <div
            v-for="(file, index) in rPendingFilesStates"
            :key="index"
            class="pending-file-item"
            :class="file.status"
          >
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.sizeFormatted }}</span>
            </div>
            <div class="file-status-area">
              <span v-if="file.status === 'pending'" class="status-badge status-pending">To be uploaded</span>
              <span v-if="file.status === 'uploading'" class="status-badge status-uploading">
                上传中 {{ file.progress }}%
              </span>
              <span v-if="file.status === 'success'" class="status-badge status-success">Successed</span>
              <span v-if="file.status === 'failed'" class="status-badge status-failed">Failed</span>
            </div>
            <div v-if="file.status === 'uploading'" class="progress-bar-track">
              <div class="progress-bar-fill" :style="{ width: file.progress + '%' }"></div>
            </div>
            <div v-if="file.error" class="file-error">{{ file.error }}</div>
          </div>
        </div>
        <div class="precheck-actions">
          <button
            v-if="!rIsUploading"
            class="upload-btn start-upload-btn"
            @click="onBatchUploadInSlices"
          >Start to Upload</button>
          <button
            class="cancel-btn"
            @click="onClosePendingMode"
            :disabled="rIsUploading"
          >
            {{ rIsUploading ? 'Uploading...' : 'Close' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hide File Input -->
    <input
      ref="rFileInput"
      type="file"
      multiple
      @change="onSelectFile"
      style="display: none;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref }             from 'vue';
import { ElMessage }       from 'element-plus';
import { formatFileSize }  from '@/utils/formatter';
import { uuidv4 }          from '@/utils/rnd';
import eventBus            from '@/utils/eventBus';

import { uploadFileSlice, completeUploadFile } from '@/api/file';

import 'element-plus/es/components/message/style/css';

type FileStatus = 'pending' | 'uploading' | 'success' | 'failed';


interface PendingFileStates {
  file          : File;
  name          : string;
  size          : number;
  sizeFormatted : string;
  status        : FileStatus;
  progress      : number;
  error         : string;
}


////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Reactive Values ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const emit = defineEmits<{
  (e: 'files-uploaded', payload: { total: number; success: number; failed: number }): void;
}>();

const rFileInput          = ref<HTMLInputElement | null>(null);
const rFileModalities     = ref<any[]>([]);
const rSelectedModality   = ref<any>(null);
const rShowMethodSelector = ref(false);
const rIsUploading        = ref(false);
const rIsShowPendingFiles = ref(false);
const rPendingFilesStates = ref<PendingFileStates[]>([]);


const _closePendingMode = () => {
    if (rIsUploading.value) return;
    rIsShowPendingFiles.value = false;
    rPendingFilesStates.value = [];
    rSelectedModality.value = null;
};


const _showTextInUploadButton = () => {
  return rIsUploading.value ? '...' : ' ↑'
} 

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Below event functions /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


const onSelectModality = (modality: any) => {
  rSelectedModality.value = modality;
  rShowMethodSelector.value = false;

  console.log("rFileInput.value:", rFileInput.value)
  rFileInput.value?.click();
};


const onCloseModalityModal = () => {
  rShowMethodSelector.value = false;
  rSelectedModality.value = null;
};


const onSelectFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files);

    // Check file size (< 100MB)
    const maxSize        = 100 * 1024 * 1024; // 100MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    console.log("Selected File Names:", files)
    if (oversizedFiles.length > 0) {
      ElMessage.error(`File Size exceeds the limit 100MB: \n${oversizedFiles.map(file => `• ${file.name}`).join('\n')}`);
      target.value = '';
      return;
    }

    rPendingFilesStates.value = files.map(file => ({
      file,
      name          : file.name,
      size          : file.size,
      sizeFormatted : formatFileSize(file.size),
      status        : 'pending' as FileStatus,
      progress      : 0,
      error         : ''
    }));

    rIsShowPendingFiles.value = true;
  }
  target.value = '';
};


const onBatchUploadInSlices = async () => {
  if (rPendingFilesStates.value.length === 0) return;

  rIsUploading.value  = true;
  
  let successCount   = 0;
  let failCount      = 0;
  let duplicateCount = 0;

  for (const pendingFile of rPendingFilesStates.value) {
    if (pendingFile.status === 'success') {
      successCount++;
      continue;
    }

    pendingFile.status = 'uploading';
    pendingFile.progress = 0;
    pendingFile.error    = '';

    /**
     * @TODO
     */
    const fileId = uuidv4();

    try {

      /**
       * @TODO
       */

      console.log('Start to Uploading...')
      const successInUploading = await uploadFileSlice(
        pendingFile.file, 
        fileId,
        (percent: number) => { pendingFile.progress = percent; },
        2_000
      );
      
      const sucessInComplete = await completeUploadFile(fileId, 'text');
      
      pendingFile.status   = 'success';
      pendingFile.progress = 100;

      if (sucessInComplete && successInUploading) {
        successCount++;
      }
    } catch (error) {
      pendingFile.status = 'failed';
      pendingFile.error = error instanceof Error ? error.message : '未知错误';
      failCount++;
    }
  }

  rIsUploading.value = false;

  eventBus.triggerFileUploaded();

  const total = rPendingFilesStates.value.length;
  emit('files-uploaded', {
    total,
    success: successCount,
    failed: failCount
  });

  const parts = [];
  if (successCount > 0)   parts.push(`${successCount} Successed`);
  if (duplicateCount > 0) parts.push(`${duplicateCount} Duplicated`);
  if (failCount > 0)      parts.push(`${failCount} Failed`);

  const msg = parts.join(',');
  
  if (failCount === 0 && duplicateCount === 0) {
    ElMessage.success(`All of ${total} Files Uploaded Successfully`);
  } else if (failCount === 0) {
    ElMessage.warning(`Uploaded: ${msg}`);
  } else if (successCount > 0) {
    ElMessage.warning(`Uploaded: ${msg}`);
  } else {
    ElMessage.error(`Uploaded: ${msg}`);
  }

  _closePendingMode();
};


const onClosePendingMode = () => {
  _closePendingMode();
};


const onTriggerFileInput = async () => {
  if (rIsUploading.value) return;
  rFileModalities.value = [
    { code: 'OCR',  desc: 'Optical Character Recogntion from File as Image'}, 
    { code: 'TEXT', desc: 'Text Extraction from Raw File'}, 
  ]
  rShowMethodSelector.value = true;
};


</script>

<style scoped>
.file-uploader {
  position: relative;
}

/**
 * The upload button
 */
.upload-btn {
  width: 35px;
  height: 35px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 50%;

  cursor: pointer;
  font-size: 24px;
  font-weight: 500;
  line-height: 1;

  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: -10px;
}

.upload-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.upload-btn:active {
  transform: scale(0.95);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-overlay {
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

.modal {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.modality-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.modality-item {
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.modality-code {
  font-weight: 600;
  margin-bottom: 4px;
}

.modality-desc {
  font-size: 12px;
  color: #606266;
}

.modality-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  width: 100%;
}

.cancel-btn:hover {
  background-color: #e4e7ed;
  border-color: #c0c4cc;
}

.cancel-btn:disabled {
  background-color: #e4e7ed;
  cursor: not-allowed;
  opacity: 0.7;
}

.precheck-modal {
  max-width: 520px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.pending-file-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.pending-file-item {
  padding: 10px 12px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.2s;
}

.pending-file-item:last-child {
  border-bottom: none;
}

.pending-file-item.success {
  background-color: #f0f9eb;
}

.pending-file-item.failed {
  background-color: #fef0f0;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.file-name {
  font-size: 14px;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
}

.file-size {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.file-status-area {
  margin-bottom: 4px;
}

.status-badge {
  display: inline-block;
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 3px;
  font-weight: 500;
}

.status-pending {
  color: #909399;
  background-color: #f4f4f5;
}

.status-uploading {
  color: #409eff;
  background-color: #ecf5ff;
}

.status-success {
  color: #67c23a;
  background-color: #f0f9eb;
}

.status-failed {
  color: #f56c6c;
  background-color: #fef0f0;
}

.progress-bar-track {
  height: 4px;
  background-color: #ebeef5;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}

.progress-bar-fill {
  height: 100%;
  background-color: #409eff;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.file-error {
  font-size: 12px;
  color: #f56c6c;
  margin-top: 4px;
  word-break: break-all;
}

.precheck-actions {
  display: flex;
  gap: 12px;
}

.start-upload-btn {
  flex: 1;
}

.precheck-actions .cancel-btn {
  flex: 1;
}
</style>
